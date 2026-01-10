import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// --- Helpers ---
const formatResponse = (data) => ({ data });
const formatError = (code, message) => ({ error: { code, message } });

const generateId = (prefix) => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const getTimestamp = () => new Date().toISOString();

// --- 1. GET /columns (Include Cards) ---
server.get("/columns", (req, res) => {
  const db = router.db;
  const columns = db.get("columns").value();
  const cards = db.get("cards").value();

  const result = columns
    .map((col) => ({
      ...col,
      cards: cards.filter((card) => card.column_id === col.id).sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => a.order - b.order);

  res.json(formatResponse(result));
});

// --- 2. POST /columns ---
server.post("/columns", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json(formatError("VALIDATION_ERROR", "컬럼 제목은 필수입니다."));
  }

  const db = router.db;
  const columns = db.get("columns").value();
  const maxOrder = columns.length > 0 ? Math.max(...columns.map((c) => c.order)) : -1;

  const newColumn = {
    id: generateId("col"),
    title,
    order: maxOrder + 1,
    created_at: getTimestamp(),
  };

  db.get("columns").push(newColumn).write();
  res.status(201).json(formatResponse(newColumn));
});

// --- 3. PATCH /columns/:id ---
server.patch("/columns/:id", (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const column = db.get("columns").find({ id }).value();

  if (!column) {
    return res.status(404).json(formatError("NOT_FOUND", "해당 컬럼을 찾을 수 없습니다."));
  }

  const updatedColumn = db.get("columns").find({ id }).assign(req.body).value();

  db.write();
  res.json(formatResponse(updatedColumn));
});

// --- 4. DELETE /columns/:id (Cascade Delete) ---
server.delete("/columns/:id", (req, res) => {
  const { id } = req.params;
  const db = router.db;

  // Delete Cards first
  const cardsToRemove = db.get("cards").filter({ column_id: id }).value();
  db.get("cards").remove({ column_id: id }).write();

  // Delete Column
  db.get("columns").remove({ id }).write();

  res.json(
    formatResponse({
      success: true,
      deleted_cards_count: cardsToRemove.length,
    })
  );
});

// --- 5. POST /cards ---
server.post("/cards", (req, res) => {
  const { column_id, title, description, due_date } = req.body;

  if (!title || title.length < 1 || title.length > 100) {
    return res
      .status(400)
      .json(formatError("VALIDATION_ERROR", "카드 제목은 1~100자 이내로 입력해주세요."));
  }

  const db = router.db;
  const columnCards = db.get("cards").filter({ column_id }).value();
  const maxOrder = columnCards.length > 0 ? Math.max(...columnCards.map((c) => c.order)) : -1;

  const newCard = {
    id: generateId("card"),
    column_id,
    title,
    description: description || "",
    due_date: due_date || null,
    order: maxOrder + 1,
    created_at: getTimestamp(),
    updated_at: getTimestamp(),
  };

  db.get("cards").push(newCard).write();
  res.status(201).json(formatResponse(newCard));
});

// --- 6. PATCH /cards/:id ---
server.patch("/cards/:id", (req, res, next) => {
  // Check if this is a 'move' request path (handled by specific route below?)
  // Express matches top-down. If we put /cards/:id/move before this, it's safer.
  // Actually, standard params won't catch /move if defined explicitly before.
  // But let's define /move BEFORE /:id just in case or inside here.
  // However, I will define /move as a separate route handler BEFORE this one.
  next();
});

// Custom Route for Move needs to be defined BEFORE generic /cards/:id if we use exact matching logic or regex,
// but Since /cards/:id/move is more specific, let's define it first.

server.patch("/cards/:id/move", (req, res) => {
  const { id } = req.params;
  const { target_column_id, new_order } = req.body;
  const db = router.db;

  const card = db.get("cards").find({ id }).value();
  if (!card) return res.status(404).json(formatError("NOT_FOUND", "Card not found"));

  const oldColumnId = card.column_id;
  const currentOrder = card.order;

  // Assign new column if changed
  const targetColumnId = target_column_id || oldColumnId;

  // 1. Remove from old position
  // If staying in same column, we logically remove it first to calculate new indices?
  // Easier approach: Get all cards in target column (excluding self if same column)
  // Insert at new_order.
  // Re-assign orders.

  // Simplified logic:
  // Update the card's column_id

  db.get("cards")
    .find({ id })
    .assign({
      column_id: targetColumnId,
      updated_at: getTimestamp(),
    })
    .write();

  // Reordering logic
  const targetCards = db
    .get("cards")
    .filter({ column_id: targetColumnId })
    .value()
    .sort((a, b) => a.order - b.order);

  // Note: The card is already in targetCards because we updated the DB.
  // We need to re-sort them based on the new_order.

  // Remove the card from the array
  const otherCards = targetCards.filter((c) => c.id !== id);

  // Insert at new_order
  otherCards.splice(new_order, 0, db.get("cards").find({ id }).value());

  // Update order for all cards in that column
  otherCards.forEach((c, index) => {
    db.get("cards").find({ id: c.id }).assign({ order: index }).write();
  });

  // If moved to a different column, might need to reorder the old column?
  // The spec didn't strictly require closing gaps in the old column, but it's good practice.
  if (oldColumnId !== targetColumnId) {
    const oldCards = db
      .get("cards")
      .filter({ column_id: oldColumnId })
      .value()
      .sort((a, b) => a.order - b.order);

    oldCards.forEach((c, index) => {
      db.get("cards").find({ id: c.id }).assign({ order: index }).write();
    });
  }

  const updatedCard = db.get("cards").find({ id }).value();
  res.json(formatResponse(updatedCard));
});

// Generic PATCH /cards/:id (After move handler)
server.patch("/cards/:id", (req, res) => {
  const { id } = req.params;
  const db = router.db;
  const card = db.get("cards").find({ id }).value();

  if (!card) {
    return res.status(404).json(formatError("NOT_FOUND", "해당 카드를 찾을 수 없습니다."));
  }

  const updatedCard = db
    .get("cards")
    .find({ id })
    .assign({
      ...req.body,
      updated_at: getTimestamp(),
    })
    .value();

  db.write();
  res.json(formatResponse(updatedCard));
});

// --- 7. DELETE /cards/:id ---
server.delete("/cards/:id", (req, res) => {
  const { id } = req.params;
  const db = router.db;

  db.get("cards").remove({ id }).write();

  res.json(formatResponse({ success: true }));
});

server.use(router);

server.listen(3001, () => {
  console.log("JSON Server (Custom) is running on port 3001");
});
