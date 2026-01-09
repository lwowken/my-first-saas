"use client";

type Props = {
  items: string[];
  onDelete: (index: number) => void;
};

export default function ItemList({ items, onDelete }: Props) {
  return (
    <ul className="w-64 space-y-2">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-center justify-between border px-3 py-2 rounded"
        >
          <span>{item}</span>
          <button
            className="text-red-500"
            onClick={() => onDelete(index)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
