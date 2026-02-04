import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { useEffect } from "react";

export default function RichTextEditor({
  value,
  onChange,
  darkMode = false,
  placeholder = "Write task details here…",
  minHeight = "fit-content",
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[220px] px-3 py-2",
        placeholder,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value]);

  if (!editor) return null;

  const btn = (active) =>
    `btn btn-sm ${
      active
        ? "btn-primary"
        : darkMode
        ? "btn-outline-light"
        : "btn-outline-secondary"
    }`;

  return (
    <div
      className={`border rounded shadow-sm ${
        darkMode ? "bg-dark text-light" : "bg-white"
      }`}
    >
      {/* Toolbar */}
      <div
        className={`d-flex flex-wrap align-items-center gap-2 px-2 py-2 border-bottom sticky-top ${
          darkMode ? "bg-dark" : "bg-light"
        }`}
      >
        {/* Headings */}
        <div className="btn-group">
          <button
            className={btn(editor.isActive("heading", { level: 1 }))}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1 size={16} />
          </button>
          <button
            className={btn(editor.isActive("heading", { level: 2 }))}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 size={16} />
          </button>
          <button
            className={btn(editor.isActive("heading", { level: 3 }))}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 size={16} />
          </button>
        </div>

        {/* Text Style */}
        <div className="btn-group">
          <button
            className={btn(editor.isActive("bold"))}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={16} />
          </button>
          <button
            className={btn(editor.isActive("italic"))}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={16} />
          </button>
          <button
            className={btn(editor.isActive("underline"))}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Underline size={16} />
          </button>
          <button
            className={btn(editor.isActive("strike"))}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough size={16} />
          </button>
        </div>

        {/* Lists */}
        <div className="btn-group">
          <button
            className={btn(editor.isActive("bulletList"))}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={16} />
          </button>
          <button
            className={btn(editor.isActive("orderedList"))}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={16} />
          </button>
        </div>

        {/* Link */}
        <button
          className={btn(editor.isActive("link"))}
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <LinkIcon size={16} />
        </button>
      </div>

      {/* Editor */}
      <div
        className={`p-3 ${darkMode ? "bg-dark text-light" : "bg-white"}`}
        style={{ minHeight }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
