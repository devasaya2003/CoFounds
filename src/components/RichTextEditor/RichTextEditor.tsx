'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import { EditorToolbar } from './EditorToolbar';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  initialValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
  onContentReady?: () => void; // New callback for content loaded event
}

export default function RichTextEditor({
  initialValue = '',
  onChange,
  placeholder = 'Start writing...',
  minHeight = '200px',
  disabled = false,
  onContentReady
}: RichTextEditorProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Highlight,
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      // Only trigger onChange after initial content has been loaded
      if (isInitialized) {
        onChange?.(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none px-4 py-2 ${disabled ? 'cursor-not-allowed opacity-75' : ''}`,
        style: `min-height: ${minHeight}`,
      },
    },
    editable: !disabled,
    immediatelyRender: false,
  });

  
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  // Track when editor has loaded initial content
  useEffect(() => {
    if (editor && !isInitialized) {
      // Use a MutationObserver to track DOM changes in the editor
      const editorElement = editor.view.dom;
      
      const observer = new MutationObserver((mutations) => {
        // If we detect mutations in the editor and initial content is rendered
        setIsInitialized(true);
        onContentReady?.();
        observer.disconnect();
      });
      
      observer.observe(editorElement, { 
        childList: true, 
        subtree: true, 
        characterData: true 
      });
      
      // Fallback to ensure we don't get stuck
      const timeoutId = setTimeout(() => {
        if (!isInitialized) {
          setIsInitialized(true);
          onContentReady?.();
          observer.disconnect();
        }
      }, 500);
      
      return () => {
        observer.disconnect();
        clearTimeout(timeoutId);
      };
    }
  }, [editor, isInitialized, onContentReady]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`bg-white rounded-md border border-gray-300 overflow-hidden ${
      disabled ? 'bg-gray-50' : ''
    }`}>
      <EditorToolbar editor={editor} disabled={disabled} />
      <EditorContent editor={editor} />
    </div>
  );
}