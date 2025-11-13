# 📦 Rich Text Editor - React Component

A powerful, feature-rich, and customizable rich text editor built for React applications. This editor provides a wide range of formatting options, plugin support, and security features including HTML sanitization.

---

## 📋 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Basic Usage](#-basic-usage)
- [Props API](#-props-api)
- [Features](#-features)
  - [Core Features](#core-features)
  - [Security Features](#security-features)
  - [Customization Options](#customization-options)
- [Plugins](#-plugins)
  - [Plugin Types](#plugin-types)
  - [Plugin Examples](#plugin-examples)
- [Theming](#-theming)
- [Examples](#-examples)
  - [Basic Editor](#basic-editor)
  - [Editor with Restricted Tags](#editor-with-restricted-tags)
  - [Editor with Custom Plugins](#editor-with-custom-plugins)
  - [Form Integration](#form-integration)

---

## 📦 Installation

Install the package using npm or yarn:

```bash
npm install rich-text-editor
```

or

```bash
yarn add rich-text-editor
```

---

## 🚀 Quick Start

```jsx
import React, { useState } from 'react';
import Editor from 'rich-text-editor';
import 'rich-text-editor/dist/styles.css';

function App() {
  const [content, setContent] = useState('');

  return (
    <div>
      <h1>My Rich Text Editor</h1>
      <Editor
        value={content}
        onChange={setContent}
        height={400}
        width="100%"
      />
    </div>
  );
}

export default App;
```

---

## 📖 Basic Usage

The editor is a controlled component that requires `value` and `onChange` props:

```jsx
import React, { useState } from 'react';
import Editor from 'rich-text-editor';
import 'rich-text-editor/dist/styles.css';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <Editor
      value={content}
      onChange={setContent}
      height={400}
      width="100%"
    />
  );
}
```

---

## 🔧 Props API

The Editor component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `""` | The HTML content of the editor |
| `onChange` | `function` | `undefined` | Callback function when content changes. Receives the HTML string as parameter |
| `height` | `string \| number` | `"auto"` | Height of the editor. Can be `"auto"`, `"responsive"`, or a number in pixels |
| `width` | `string \| number` | `"100%"` | Width of the editor. Can be `"auto"`, `"responsive"`, or a number in pixels |
| `minHeight` | `number` | `200` | Minimum height of the editor in pixels |
| `className` | `string` | `""` | Additional CSS class for the editor container |
| `allowedTags` | `array` | `null` | Array of allowed HTML tags. If `null`, all tags are allowed |
| `storageKey` | `string` | `"rte-editor-content"` | Key for localStorage to save content. Set to `""` to disable auto-save |
| `plugins` | `array` | `[]` | Array of custom plugins to extend functionality |

### Props Examples

```jsx
// Fixed height editor
<Editor
  value={content}
  onChange={setContent}
  height={500}
  width="100%"
/>

// Responsive editor
<Editor
  value={content}
  onChange={setContent}
  height="responsive"
  width="responsive"
/>

// Editor with custom class
<Editor
  value={content}
  onChange={setContent}
  className="my-custom-editor"
/>

// Editor without auto-save
<Editor
  value={content}
  onChange={setContent}
  storageKey=""
/>
```

---

## ✨ Features

### Core Features

- **Rich Text Formatting**
  - Bold, italic, underline, strikethrough
  - Superscript and subscript
  - Text color and highlighting
  - Case conversion (uppercase/lowercase)

- **Text Structure**
  - Headings (H1-H6)
  - Paragraphs
  - Text alignment (left, center, right)
  - Blockquotes with citation support

- **Lists**
  - Ordered lists (1, 2, 3 / a, b, c / I, II, III / etc.)
  - Unordered lists (disc, circle, square)
  - Nested list support

- **Media & Links**
  - Insert and edit images with customizable properties
  - Image alignment and styling (border, margin, border-radius)
  - Insert and remove links
  - Links automatically open in new tab with security attributes

- **Tables**
  - Insert tables with customizable rows and columns
  - Visual grid selector for table creation

- **Content Management**
  - Undo/Redo functionality
  - Copy/Cut/Paste with HTML sanitization
  - Search and highlight text within the editor
  - Select all text
  - Delete selected text

- **Advanced Features**
  - HTML code view toggle
  - Emoji picker
  - Preview mode (markdown preview)
  - Horizontal rules
  - Auto-save to localStorage

### Security Features

- **HTML Sanitization**: Uses DOMPurify to sanitize HTML content
- **Allowed Tags Control**: Restrict which HTML tags can be used
- **XSS Protection**: Prevents cross-site scripting attacks
- **Safe Paste**: Cleans pasted content from Word and other sources

### Customization Options

- **Plugin System**: Extend functionality with custom plugins
- **Theme Support**: Light and dark themes with automatic system preference detection
- **Customizable Toolbar**: Show/hide toolbar buttons based on allowed tags
- **Responsive Design**: Works on all screen sizes
- **Tag Selector**: Configure which HTML tags and actions are allowed

---

## 🔌 Plugins

The editor supports custom plugins to extend its functionality. Plugins can be defined in several ways:

### Plugin Types

#### 1. HTML Tag Plugin

Wraps selected text with a custom HTML tag:

```jsx
{
  name: "highlight",
  icon: <FaHighlighter />,
  title: "Highlight Text",
  tag: "mark"
}
```

#### 2. Command Plugin

Executes a document command:

```jsx
{
  name: "heading2",
  icon: "H2",
  title: "Heading 2",
  cmd: "formatBlock",
  arg: "h2"
}
```

#### 3. Action Plugin

Executes a custom function:

```jsx
{
  name: "timestamp",
  icon: <FaClock />,
  title: "Insert Timestamp",
  action: (editor) => {
    const now = new Date();
    const timestamp = now.toLocaleString();
    document.execCommand("insertText", false, timestamp);
  }
}
```

#### 4. Type Plugin

Uses built-in plugin types:

```jsx
{
  name: "timestamp",
  icon: <FaClock />,
  title: "Insert Time",
  type: "timestamp"
}
```

### Plugin Examples

#### Example 1: Multiple Plugins

```jsx
import { FaHighlighter, FaClock } from 'react-icons/fa';

const customPlugins = [
  {
    name: "timestamp",
    icon: "⏱️",
    title: "Insert Timestamp",
    action: (editor) => {
      const now = new Date();
      const timestamp = now.toLocaleString();
      document.execCommand("insertText", false, timestamp);
    },
  },
  {
    name: "heading2",
    icon: "H2",
    title: "Heading 2",
    cmd: "formatBlock",
    arg: "h2"
  },
  {
    name: "underline",
    icon: "U",
    title: "Underline Text",
    cmd: "underline"
  },
  {
    name: "mark",
    icon: <FaHighlighter />,
    title: "Highlight",
    tag: "mark"
  },
  {
    name: "timestamp",
    icon: <FaClock />,
    title: "Insert Time",
    type: "timestamp"
  },
];

// Usage
<Editor
  value={content}
  onChange={setContent}
  plugins={customPlugins}
/>
```

#### Example 2: Custom Plugin with React Icons

```jsx
import { FaCode, FaBold } from 'react-icons/fa';

const codePlugin = {
  name: "code",
  icon: <FaCode />,
  title: "Insert Code Block",
  action: (editor) => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    const codeBlock = `<pre><code>${selectedText || 'Your code here'}</code></pre>`;
    document.execCommand("insertHTML", false, codeBlock);
  }
};

<Editor
  value={content}
  onChange={setContent}
  plugins={[codePlugin]}
/>
```

---

## 🎨 Theming

The editor supports light and dark themes with automatic system preference detection.

### Theme Features

- **Automatic Theme Detection**: Respects system color scheme preference
- **Theme Persistence**: Theme preference is saved to localStorage
- **Global Theme**: Theme is shared across all editor instances
- **Manual Toggle**: Users can toggle theme using the theme button in the toolbar

### Theme Usage

The theme is automatically managed by the editor. Users can toggle between light and dark themes using the theme button (🌙/☀️) in the toolbar. The theme preference is saved and will persist across sessions.

---

## 📝 Examples

### Basic Editor

```jsx
import React, { useState } from 'react';
import Editor from 'rich-text-editor';
import 'rich-text-editor/dist/styles.css';

function BasicEditor() {
  const [content, setContent] = useState('');

  return (
    <div>
      <h2>Basic Editor</h2>
      <Editor
        value={content}
        onChange={setContent}
        height={400}
        width="100%"
      />
      <div>
        <h3>Output:</h3>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
```

### Editor with Restricted Tags

```jsx
import React, { useState } from 'react';
import Editor from 'rich-text-editor';
import 'rich-text-editor/dist/styles.css';

function RestrictedEditor() {
  const [content, setContent] = useState('');

  return (
    <Editor
      value={content}
      onChange={setContent}
      height={300}
      width="100%"
      allowedTags={[
        'p', 'h1', 'h2', 'h3', 'h4', 'h5', 
        'strong', 'em', 'table', 'img', 
        'thead', 'tbody', 'tr', 'th', 'td', 
        'br', 'u'
      ]}
      storageKey=""
    />
  );
}
```

### Editor with Custom Plugins

```jsx
import React, { useState } from 'react';
import Editor from 'rich-text-editor';
import 'rich-text-editor/dist/styles.css';
import { FaHighlighter, FaClock } from 'react-icons/fa';

function CustomPluginEditor() {
  const [content, setContent] = useState('');

  const customPlugins = [
    {
      name: "timestamp",
      icon: <FaClock />,
      title: "Insert Timestamp",
      type: "timestamp"
    },
    {
      name: "highlight",
      icon: <FaHighlighter />,
      title: "Highlight Text",
      tag: "mark"
    }
  ];

  return (
    <Editor
      value={content}
      onChange={setContent}
      plugins={customPlugins}
      height={400}
    />
  );
}
```

### Form Integration

```jsx
import React, { useState } from 'react';
import Editor from 'rich-text-editor';
import 'rich-text-editor/dist/styles.css';

function FormWithEditor() {
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });

  const handleEditorChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Submit your form data
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            title: e.target.value
          }))}
        />
      </div>
      
      <div>
        <label>Message:</label>
        <Editor
          value={formData.message}
          onChange={(value) => handleEditorChange('message', value)}
          height={300}
          width="100%"
          allowedTags={[
            'p', 'h1', 'h2', 'h3', 'strong', 'em', 
            'table', 'img', 'ul', 'ol', 'li', 'br'
          ]}
          storageKey=""
        />
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 🔒 Security

The editor includes built-in security features:

- **DOMPurify Integration**: All HTML content is sanitized using DOMPurify
- **XSS Protection**: Prevents cross-site scripting attacks
- **Tag Whitelisting**: Control which HTML tags are allowed
- **Safe Paste**: Automatically cleans pasted content from external sources

### Recommended Security Practices

1. **Restrict Allowed Tags**: Use the `allowedTags` prop to limit which HTML tags can be used
2. **Sanitize on Server**: Always sanitize content on the server side before storing
3. **Validate Content**: Validate editor content before processing or displaying

---

## 📚 Additional Resources

### Supported HTML Tags

The editor supports the following HTML tags (when allowed):

- **Text Formatting**: `p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `strong`, `em`, `u`, `s`, `sup`, `sub`, `span`
- **Structure**: `div`, `blockquote`, `pre`, `code`, `br`, `hr`
- **Lists**: `ul`, `ol`, `li`
- **Links & Media**: `a`, `img`
- **Tables**: `table`, `thead`, `tbody`, `tr`, `th`, `td`

### Browser Support

The editor works in all modern browsers that support:
- ContentEditable API
- localStorage
- ES6+ JavaScript features

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the MIT License.

---

## 💡 Tips

- Use `storageKey=""` to disable auto-save if you're managing state externally
- The `allowedTags` prop is useful for restricting formatting options based on your use case
- Plugins are a great way to add custom functionality without modifying the core editor
- The theme automatically adapts to system preferences, but users can override it manually

---

**Happy Editing! 🎉**
