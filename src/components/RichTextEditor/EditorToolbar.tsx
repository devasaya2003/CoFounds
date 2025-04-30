'use client';

import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Highlighter,
  Undo,
  Redo,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor;
  disabled?: boolean; 
}

export function EditorToolbar({ editor, disabled = false }: EditorToolbarProps) {
  const addImage = () => {
    
    if (disabled) return;
    
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    
    if (disabled) return;
    
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className={`border-b border-gray-200 p-2 flex flex-wrap gap-1 ${disabled ? 'opacity-75 bg-gray-50' : ''}`}>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Bold"
        disabled={disabled}
      >
        <Bold size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Italic"
        disabled={disabled}
      >
        <Italic size={18} />
      </ToolbarButton>
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
        disabled={disabled}
      >
        <Heading1 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
        disabled={disabled}
      >
        <Heading2 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
        disabled={disabled}
      >
        <Heading3 size={18} />
      </ToolbarButton>
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Bullet List"
        disabled={disabled}
      >
        <List size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Numbered List"
        disabled={disabled}
      >
        <ListOrdered size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="Quote"
        disabled={disabled}
      >
        <Quote size={18} />
      </ToolbarButton>
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <ToolbarButton 
        onClick={setLink} 
        active={editor.isActive('link')} 
        title="Add Link"
        disabled={disabled}
      >
        <LinkIcon size={18} />
      </ToolbarButton>
      <ToolbarButton 
        onClick={addImage} 
        active={editor.isActive('image')} 
        title="Add Image"
        disabled={disabled}
      >
        <ImageIcon size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        active={editor.isActive('highlight')}
        title="Highlight"
        disabled={disabled}
      >
        <Highlighter size={18} />
      </ToolbarButton>
      <div className="w-px h-6 bg-gray-200 mx-1" />
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={disabled || !editor.can().undo()}
        title="Undo"
      >
        <Undo size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={disabled || !editor.can().redo()}
        title="Redo"
      >
        <Redo size={18} />
      </ToolbarButton>
    </div>
  );
}

interface ToolbarButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}

function ToolbarButton({ onClick, children, active, disabled, title }: ToolbarButtonProps) {
  
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };
  
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition-colors ${
        active ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-600 hover:bg-gray-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''}`}
    >
      {children}
    </button>
  );
}
