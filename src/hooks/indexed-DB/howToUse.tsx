import Button from "@/components/ui/buttons/Button";
import InputForm from "@/components/ui/input/InputForm";
import Text from "@/components/ui/typography/Text";
import { useIndexedDB } from "@/hooks/indexed-DB/useIndexedDB";
import { Box, HStack, IconButton, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuPencil, LuPlus, LuTrash2, LuX, LuCheck } from "react-icons/lu";
import { LocalRecord } from "./types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Fruit extends LocalRecord {
  // local_id: string  — IDB keyPath  (LocalRecord dan keladi)
  // id: string | null — server ID, hozircha null (LocalRecord dan keladi)
  fruitName: string;
  fruitTypes: number[];
  fruitColors: {
    front: string;
    back: string;
  };
}

// ─── Empty form ──────────────────────────────────────────────────────────────

const emptyForm: Omit<Fruit, "local_id" | "id"> = {
  fruitName: "",
  fruitTypes: [],
  fruitColors: { front: "", back: "" },
};

// ─── Component ───────────────────────────────────────────────────────────────

const howToUse = () => {
  const { isReady, getAll, add, edit, remove, get } = useIndexedDB<Fruit>({
    dbName: "",
    storeName: "",
  });

  // ── State ──────────────────────────────────────────────────────────────────
  const [list, setList] = useState<Fruit[]>([]);
  const [form, setForm] = useState<Omit<Fruit, "local_id" | "id">>(emptyForm);
  const [editingLocalId, setEditingLocalId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const fetchAll = async () => {
    const data = await getAll();
    setList(data);
  };

  useEffect(() => {
    if (!isReady) return;
    fetchAll();
  }, [isReady]);

  // ── CRUD ───────────────────────────────────────────────────────────────────

  const handleAdd = async () => {
    if (!form.fruitName.trim()) return;
    const newItem: Fruit = {
      ...form,
      local_id: Date.now(), // IDB kalit
      id: null, // server ID — hozircha null
    };
    await add(newItem);
    await fetchAll();
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleStartEdit = (item: Fruit) => {
    setEditingLocalId(item.local_id);
    setForm({
      fruitName: item.fruitName,
      fruitTypes: item.fruitTypes,
      fruitColors: { ...item.fruitColors },
    });
    setShowForm(true);
  };

  const handleEdit = async () => {
    if (editingLocalId === null || !form.fruitName.trim()) return;
    const existing = await get(editingLocalId);
    await edit({
      ...form,
      local_id: editingLocalId,
      id: existing?.id ?? null, // mavjud server ID ni saqlаymiz
    });
    await fetchAll();
    setEditingLocalId(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleDelete = async (local_id: number) => {
    await remove(local_id);
    await fetchAll();
  };

  const handleCancel = () => {
    setEditingLocalId(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <VStack align="stretch" gap={3}>
      {/* ── ADD button ── */}
      {!showForm && (
        <Button
          size="sm"
          variant="outline"
          colorPalette="purple"
          onClick={() => setShowForm(true)}
        >
          <LuPlus />
          Добавить
        </Button>
      )}

      {/* ── FORM ── */}
      {showForm && (
        <Box
          p={4}
          borderWidth="1px"
          borderColor="var(--border-input)"
          borderRadius="xl"
        >
          <VStack gap={3}>
            <InputForm
              label="Название фрукта"
              placeholder="Apple"
              value={form.fruitName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, fruitName: e.target.value }))
              }
            />

            <InputForm
              label="Типы (через запятую, числа)"
              placeholder="1, 2, 3"
              value={form.fruitTypes.join(", ")}
              onChange={(e) => {
                const parsed = e.target.value
                  .split(",")
                  .map((s) => Number(s.trim()))
                  .filter((n) => !isNaN(n) && n !== 0);
                setForm((prev) => ({ ...prev, fruitTypes: parsed }));
              }}
            />

            <HStack w="full" gap={2}>
              <InputForm
                label="Цвет спереди"
                placeholder="red"
                value={form.fruitColors.front}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    fruitColors: { ...prev.fruitColors, front: e.target.value },
                  }))
                }
              />
              <InputForm
                label="Цвет сзади"
                placeholder="green"
                value={form.fruitColors.back}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    fruitColors: { ...prev.fruitColors, back: e.target.value },
                  }))
                }
              />
            </HStack>

            <HStack w="full" gap={2}>
              <Button
                size="sm"
                colorPalette="purple"
                onClick={editingLocalId !== null ? handleEdit : handleAdd}
              >
                <LuCheck />
                {editingLocalId !== null ? "Сохранить" : "Добавить"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <LuX />
                Отмена
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}

      {/* ── LIST ── */}
      {list.length === 0 && !showForm && (
        <Text color="var(--text-secondary)" fontSize="sm">
          Список пуст
        </Text>
      )}

      {list.map((item) => (
        <Box
          key={item.local_id}
          p={3}
          borderWidth="1px"
          borderColor="var(--border-list)"
          borderRadius="xl"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <VStack align="start" gap={0.5} flex={1} minW={0}>
            <Text fontWeight="600" truncate>
              {item.fruitName}
            </Text>
            <Text fontSize="xs" color="var(--text-secondary)">
              Типы: [{item.fruitTypes.join(", ") || "—"}]
            </Text>
            <HStack gap={2}>
              <HStack gap={1}>
                <Box
                  w="12px"
                  h="12px"
                  borderRadius="full"
                  bg={item.fruitColors.front || "gray.300"}
                  borderWidth="1px"
                  borderColor="var(--border-input)"
                />
                <Text fontSize="xs">{item.fruitColors.front || "—"}</Text>
              </HStack>
              <HStack gap={1}>
                <Box
                  w="12px"
                  h="12px"
                  borderRadius="full"
                  bg={item.fruitColors.back || "gray.300"}
                  borderWidth="1px"
                  borderColor="var(--border-input)"
                />
                <Text fontSize="xs">{item.fruitColors.back || "—"}</Text>
              </HStack>
            </HStack>
          </VStack>

          <HStack gap={1} flexShrink={0}>
            <IconButton
              aria-label="edit"
              size="sm"
              variant="ghost"
              colorPalette="purple"
              onClick={() => handleStartEdit(item)}
            >
              <LuPencil />
            </IconButton>
            <IconButton
              aria-label="delete"
              size="sm"
              variant="ghost"
              colorPalette="red"
              onClick={() => handleDelete(item.local_id)}
            >
              <LuTrash2 />
            </IconButton>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default howToUse;
