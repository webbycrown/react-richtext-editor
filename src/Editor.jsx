import React, { useRef, useState, useEffect, useMemo } from "react";
import "./styles.css";
// import { marked } from "marked";
import DOMPurify from 'dompurify';
import EmojiPicker from "emoji-picker-react";
import {
    FaUndo, FaRedo, FaBold, FaItalic, FaUnderline, FaStrikethrough,
    FaSuperscript, FaSubscript, FaAlignLeft, FaAlignCenter, FaAlignRight,
    FaQuoteRight, FaCode, FaLink, FaUnlink,
    FaImage, FaTable, FaSmile, FaPalette, FaHighlighter, FaCut, FaCopy,
    FaPaste, FaTrash, FaMousePointer, FaSearch, FaListUl, FaListOl,
    FaEye, FaEdit, FaTimes, FaChevronUp, FaChevronDown, FaCaretDown, FaTextWidth, FaTextHeight,
    FaMinus, FaCog, FaCheck, FaHeading, FaMoon, FaSun
} from 'react-icons/fa';

// Function to sanitize HTML based on allowed tags
const sanitizeHTML = (html, allowedTags) => {
    if (!allowedTags || allowedTags.length === 0) return html;

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: allowedTags,
        ALLOWED_ATTR: ['href', 'src', 'alt', 'style', 'class', 'target', 'rel', 'width', 'height', 'border', 'border-radius', 'margin', 'padding', 'text-align', 'list-style-type', 'allowedTags']
    });
};

// Function to check if HTML contains only allowed tags
const containsOnlyAllowedTags = (html, allowedTags) => {
    if (!allowedTags || allowedTags.length === 0) return false;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const allElements = tempDiv.querySelectorAll('*');
    for (const element of allElements) {
        if (!allowedTags.includes(element.tagName.toLowerCase())) {
            return false;
        }
    }

    return true;
};



// TagSelector Component
const TagSelector = ({ allowedTags, setAllowedTags, showTagSelector, setShowTagSelector, theme, allTags }) => {
    const [filterMode, setFilterMode] = useState('all');

    const toggleTag = (tag) => {
        if (allowedTags.includes(tag)) {
            setAllowedTags(allowedTags.filter(t => t !== tag));
        } else {
            setAllowedTags([...allowedTags, tag]);
        }
    };

    const selectAll = () => {
        setAllowedTags([...allTags]);
    };

    const selectNone = () => {
        setAllowedTags([]);
    };

    const getFilteredTags = () => {
        switch (filterMode) {
            case 'selected':
                return allTags.filter(tag => allowedTags.includes(tag));
            case 'deselected':
                return allTags.filter(tag => !allowedTags.includes(tag));
            default:
                return allTags;
        }
    };

    return (
        <div className="tag-selector-wrapper">
            <button
                type="button"
                className="rte-btn"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowTagSelector(!showTagSelector);
                }}
                title="Configure allowed HTML tags"
            >
                <FaCog />
            </button>

            {showTagSelector && (
                <div className={`tag-selector-popup ${theme}`}>
                    <div className="tag-selector-header">
                        <h3>Allowed HTML Tags & Actions</h3>
                        <div className="tag-selector-actions">
                            <button
                                type="button"
                                className="filter-btn all"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    selectAll();
                                }}
                            >
                                All
                            </button>
                            <button
                                type="button"
                                className="filter-btn none"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    selectNone();
                                }}
                            >
                                None
                            </button>
                            <button
                                type="button"
                                className="close-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowTagSelector(false);
                                }}
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    <div className="tag-filter-container">
                        <div className="tag-filter-options">
                            <button
                                type="button"
                                className={`filter-btn ${filterMode === 'all' ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setFilterMode('all');
                                }}
                            >
                                All
                            </button>
                            <button
                                type="button"
                                className={`filter-btn ${filterMode === 'selected' ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setFilterMode('selected');
                                }}
                            >
                                Selected
                            </button>
                            <button
                                type="button"
                                className={`filter-btn ${filterMode === 'deselected' ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setFilterMode('deselected');
                                }}
                            >
                                Deselected
                            </button>
                        </div>
                        <div className="tag-filter-info">
                            {filterMode === 'all' && (
                                <span>Showing all {allTags.length} tags and actions</span>
                            )}
                            {filterMode === 'selected' && (
                                <span>Showing {allowedTags.length} selected tags and actions</span>
                            )}
                            {filterMode === 'deselected' && (
                                <span>Showing {allTags.length - allowedTags.length} deselected tags and actions</span>
                            )}
                        </div>
                    </div>

                    <div className="tag-selector-grid">
                        {getFilteredTags().map(tag => (
                            <div
                                key={tag}
                                className={`tag-item ${allowedTags.includes(tag) ? 'selected' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleTag(tag);
                                }}
                            >
                                <span className="tag-name">{tag}</span>
                                {allowedTags.includes(tag) && <FaCheck className="tag-check" />}
                            </div>
                        ))}
                    </div>
                    <div className="tag-selector-footer">
                        <span>{allowedTags.length} of {allTags.length} tags and actions selected</span>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowTagSelector(false);
                            }}
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};



const Dropdown = ({ options, value, onChange, placeholder, icon, width = "120px", theme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const getDisplayLabel = () => {
        if (!value) return placeholder;
        const option = options.find(opt => opt.value === value);
        return option ? option.label : placeholder;
    };

    return (
        <div className="rte-dropdown" ref={dropdownRef}>
            <button
                type="button"
                className="rte-btn rte-dropdown-btn"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
            >
                {icon && <span className="rte-dropdown-icon">{icon}</span>}
                <span className="rte-dropdown-text">{getDisplayLabel()}</span>
                <FaCaretDown className="rte-dropdown-arrow" />
            </button>
            {isOpen && (
                <div className={`rte-dropdown-menu ${theme}`} style={{ width }}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`rte-dropdown-item ${value === option.value ? 'selected' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSelect(option.value);
                            }}
                            style={option.style || {}}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Toolbar buttons - combined into a single array
const toolbarButtons = [
    { cmd: "undo", icon: <FaUndo />, tooltip: "Undo" },
    { cmd: "redo", icon: <FaRedo />, tooltip: "Redo" },
    {
        type: "dropdown",
        cmd: "formatBlock",
        icon: <FaHeading />,
        options: [
            { label: "*Normal* ", value: "p" },
            { label: "Heading 1", value: "h1" },
            { label: "Heading 2", value: "h2" },
            { label: "Heading 3", value: "h3" },
            { label: "Heading 4", value: "h4" },
            { label: "Heading 5", value: "h5" },
            { label: "Heading 6", value: "h6" },
        ],
    },
    { cmd: "bold", icon: <FaBold />, tooltip: "Bold" },
    { cmd: "italic", icon: <FaItalic />, tooltip: "Italic" },
    { cmd: "underline", icon: <FaUnderline />, tooltip: "Underline" },
    { cmd: "strikeThrough", icon: <FaStrikethrough />, tooltip: "Strikethrough" },
    { cmd: "superscript", icon: <FaSuperscript />, tooltip: "Superscript" },
    { cmd: "subscript", icon: <FaSubscript />, tooltip: "Subscript" },
    { cmd: "toUpperCase", icon: <FaTextHeight />, tooltip: "Uppercase" },
    { cmd: "toLowerCase", icon: <FaTextWidth />, tooltip: "Lowercase" },
    { cmd: "justifyLeft", icon: <FaAlignLeft />, tooltip: "Align Left" },
    { cmd: "justifyCenter", icon: <FaAlignCenter />, tooltip: "Align Center" },
    { cmd: "justifyRight", icon: <FaAlignRight />, tooltip: "Align Right" },
    { cmd: "formatBlock", arg: "blockquote", icon: <FaQuoteRight />, tooltip: "Blockquote" },
    { cmd: "toggleHTML", icon: <FaCode />, tooltip: "Toggle HTML" },
    { cmd: "createLink", icon: <FaLink />, tooltip: "Insert Link" },
    { cmd: "unlink", icon: <FaUnlink />, tooltip: "Remove Link" },
    { cmd: "insertImage", icon: <FaImage />, tooltip: "Insert Image" },
    { cmd: "insertTableGrid", icon: <FaTable />, tooltip: "Insert Table" },
    { cmd: "insertEmoji", icon: <FaSmile />, tooltip: "Insert Emoji" },
    { cmd: "insertHorizontalRule", icon: <FaMinus />, tooltip: "Insert Horizontal Line" },
    { cmd: "textColor", icon: <FaPalette />, tooltip: "Text Color" },
    { cmd: "highlight", icon: <FaHighlighter />, tooltip: "Highlight Text" },
    { cmd: "cut", icon: <FaCut />, tooltip: "Cut" },
    { cmd: "copy", icon: <FaCopy />, tooltip: "Copy" },
    { cmd: "paste", icon: <FaPaste />, tooltip: "Paste" },
    { cmd: "removeText", icon: <FaTrash />, tooltip: "Delete" },
    { cmd: "selectAll", icon: <FaMousePointer />, tooltip: "Select All" },
    { cmd: "search", icon: <FaSearch />, tooltip: "Search" },
];

// List style options
const unorderedListOptions = [
    { label: "Disc", value: "disc" },
    { label: "Circle", value: "circle" },
    { label: "Square", value: "square" }
];

const orderedListOptions = [
    { label: "1, 2, 3", value: "decimal" },
    { label: "a, b, c", value: "lower-alpha" },
    { label: "A, B, C", value: "upper-alpha" },
    { label: "I, II, III", value: "upper-roman" },
    { label: "i, ii, iii", value: "lower-roman" }
];

// Helper function to check if a button should be shown based on allowed tags
const shouldShowButton = (cmd, allowedTags) => {
    const buttonTagMap = {
        'bold': 'strong',
        'italic': 'em',
        'underline': 'u',
        'strikeThrough': 's',
        'superscript': 'sup',
        'subscript': 'sub',
        'formatBlock': 'blockquote',
        'createLink': 'a',
        'insertImage': 'img',
        'insertTableGrid': 'table',
        'insertUnorderedList': 'ul',
        'insertOrderedList': 'ol'
    };

    const buttonActionMap = {
        'cut': 'cut',
        'copy': 'copy',
        'paste': 'paste',
        'removeText': 'remove',
        'textColor': 'text-color',
        'highlight': 'highlight-color',
        'insertEmoji': 'emoji',
        'selectAll': 'select',
        'toUpperCase': 'uppercase',
        'toLowerCase': 'lowercase',
        'justifyLeft': 'align-left',
        'justifyCenter': 'align-center',
        'justifyRight': 'align-right',
        'unlink': 'remove-link',
        'insertHorizontalRule': 'hr'
    };

    if (buttonActionMap[cmd]) {
        return allowedTags.includes(buttonActionMap[cmd]);
    }

    const tag = buttonTagMap[cmd];
    return !tag || allowedTags.includes(tag);
};

export default function Editor({
    value = "",
    onChange,
    height = "auto",
    width = "100%",
    minHeight = 200,
    className = "",
    allowedTags: propAllowedTags = null,
    storageKey = "rte-editor-content",
    plugins = []
}) {
    const editorRef = useRef(null);
    const editorContainerRef = useRef(null);
    const fileRef = useRef(null);
    const colorInputRef = useRef(null);
    const highlightColorRef = useRef(null);
    const [focused, setFocused] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [showTableGrid, setShowTableGrid] = useState(false);
    const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [previewContent, setPreviewContent] = useState("");

   

    // Extract plugin tags - memoized to prevent recreation on every render
    const getPluginTags = (plugins) => {
        return plugins
            .filter(plugin => plugin.tag) // only plugins that have a tag
            .map(plugin => plugin.tag);
    };

    const pluginTags = useMemo(() => getPluginTags(plugins), [plugins]);

    // The complete list of tags for the TagSelector - memoized
    const allTags = useMemo(() => [
        'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'u', 's',
        'sup', 'sub', 'blockquote', 'pre', 'code', 'ul', 'ol', 'li',
        'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'br', 'hr', 'span', 'div',
        'cut', 'copy', 'paste', 'remove', 'text-color', 'highlight-color', 'emoji', 'select', 'uppercase', 'lowercase',
        'align-left', 'align-center', 'align-right', 'remove-link',
        ...pluginTags
    ], [pluginTags]);

    // Initialize allowedTags with pluginTags included
    const [allowedTags, setAllowedTags] = useState(() => {
        const defaultAllowedTags = [
            'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'u', 's',
            'sup', 'sub', 'blockquote', 'pre', 'code', 'ul', 'ol', 'li',
            'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'br', 'hr', 'span', 'div',
            'cut', 'copy', 'paste', 'remove', 'text-color', 'highlight-color', 'emoji', 'select', 'uppercase', 'lowercase',
            'align-left', 'align-center', 'align-right', 'remove-link',
            ...pluginTags
        ];

        if (propAllowedTags) {
            // Merge propAllowedTags with pluginTags, making sure to include all pluginTags
            return [...new Set([...propAllowedTags, ...pluginTags])];
        }
        return defaultAllowedTags;
    });

    const [showTagSelector, setShowTagSelector] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
    const [showSearch, setShowSearch] = useState(false);
    const [searchCount, setSearchCount] = useState(0);

    const [selectedImage, setSelectedImage] = useState(null);
    const [showImageEditor, setShowImageEditor] = useState(false);
    const [imageProps, setImageProps] = useState({
        width: '',
        height: '',
        alignment: '',
        borderWidth: '',
        borderStyle: '',
        borderColor: '#000000',
        borderRadius: '',
        margin: '',
        altText: '',
        lockAspectRatio: true
    });
    const [aspectRatio, setAspectRatio] = useState(1);

    const [isResizing, setIsResizing] = useState(false);
    const [resizeData, setResizeData] = useState({
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        handle: null
    });

    const [overlayStyle, setOverlayStyle] = useState({
        display: 'none',
        left: 0,
        top: 0,
        width: 0,
        height: 0
    });

    const [currentHeading, setCurrentHeading] = useState('p');
    const [currentFontSize, setCurrentFontSize] = useState('16px');

    // Keep only the global theme management system
    const GLOBAL_THEME_KEY = 'rte-global-theme';

    // Initialize theme with safe default for SSR (prevents hydration mismatch)
    // Will be updated from localStorage after mount on client side
    const [theme, setTheme] = useState('light');
    const [mounted, setMounted] = useState(false);

    // Active formatting state
    const [activeFormatting, setActiveFormatting] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        superscript: false,
        subscript: false,
        justifyLeft: false,
        justifyCenter: false,
        justifyRight: false,
        insertUnorderedList: false,
        insertOrderedList: false
    });

    const savedSelectionRef = useRef(null);
    const savedTableSelectionRef = useRef(null);
    const savedEmojiSelectionRef = useRef(null);
    const isSettingContent = useRef(false);

    // Initialize theme from localStorage after mount (client-side only)
    useEffect(() => {
        setMounted(true);
        try {
            const savedTheme = localStorage.getItem(GLOBAL_THEME_KEY);
            if (savedTheme === 'dark' || savedTheme === 'light') {
                setTheme(savedTheme);
            } else {
                // Fallback to system preference if no saved theme
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setTheme(prefersDark ? 'dark' : 'light');
            }
        } catch (e) {
            console.error('Error reading theme from localStorage:', e);
        }
    }, []);

    // Save theme preference to localStorage whenever it changes (only after mount)
    useEffect(() => {
        if (mounted) {
            try {
                localStorage.setItem(GLOBAL_THEME_KEY, theme);
            } catch (e) {
                console.error('Error saving theme to localStorage:', e);
            }
        }
    }, [theme, mounted]);

    // Add this useEffect to apply theme to document body (only after mount)
    useEffect(() => {
        if (mounted) {
            document.body.className = theme;
        }
    }, [theme, mounted]);

    // Add this useEffect to listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            // Only change if user hasn't manually set a preference
            if (!localStorage.getItem(GLOBAL_THEME_KEY)) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    // Toggle theme function
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const updateActiveFormatting = () => {
        if (!editorRef.current) return;

        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;

        // Check if the selection is within the editor
        let node = container;
        while (node && node !== editorRef.current) {
            node = node.parentNode;
        }

        // If the selection is not within the editor, do nothing
        if (node !== editorRef.current) return;

        // Get the current block element
        const blockElement = container.nodeType === 3
            ? container.parentNode
            : container;

        // Check formatting only within the current block
        const blockRange = document.createRange();
        blockRange.selectNodeContents(blockElement);

        setActiveFormatting({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            strikethrough: document.queryCommandState('strikeThrough'),
            superscript: document.queryCommandState('superscript'),
            subscript: document.queryCommandState('subscript'),
            justifyLeft: document.queryCommandState('justifyLeft'),
            justifyCenter: document.queryCommandState('justifyCenter'),
            justifyRight: document.queryCommandState('justifyRight'),
            insertUnorderedList: document.queryCommandState('insertUnorderedList'),
            insertOrderedList: document.queryCommandState('insertOrderedList')
        });
    };

    // Listen for selection changes to update active formatting
    useEffect(() => {
        const handleSelectionChange = () => {
            updateActiveFormatting();
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, []);

    // Update active formatting when editor is focused
    useEffect(() => {
        if (focused) {
            updateActiveFormatting();
        }
    }, [focused]);

    // Update active formatting after content changes
    useEffect(() => {
        updateActiveFormatting();
    }, [value]);

    useEffect(() => {
        if (!storageKey) return;

        try {
            const savedContent = localStorage.getItem(`${storageKey}-content`);
            if (savedContent && !value) {
                setTimeout(() => {
                    if (editorRef.current) {
                        editorRef.current.innerHTML = savedContent;
                    }
                }, 0);
            }

            const savedTags = localStorage.getItem(`${storageKey}-allowedTags`);
            if (savedTags) {
                try {
                    const parsedTags = JSON.parse(savedTags);
                    if (Array.isArray(parsedTags) && parsedTags.length > 0) {
                        setAllowedTags(parsedTags);
                    }
                } catch (e) {
                    console.error('Error parsing saved allowed tags:', e);
                }
            }
        } catch (e) {
            console.error('Error accessing localStorage:', e);
        }
    }, [storageKey, value]);

    // Memoize the effect dependencies to prevent unnecessary updates
    useEffect(() => {
        if (propAllowedTags && Array.isArray(propAllowedTags)) {
            // Merge propAllowedTags with pluginTags
            const mergedTags = [...new Set([...propAllowedTags, ...pluginTags])];
            setAllowedTags(mergedTags);
        }
    }, [propAllowedTags, pluginTags]);

    const handleChange = () => {
        if (isSettingContent.current) return;

        if (!editorRef.current) return;

        const selection = window.getSelection();
        let savedRange = null;
        if (selection.rangeCount > 0) {
            savedRange = selection.getRangeAt(0).cloneRange();
        }

        let html = editorRef.current.innerHTML;

        if (!containsOnlyAllowedTags(html, allowedTags)) {
            html = sanitizeHTML(html, allowedTags);

            if (editorRef.current.innerHTML !== html) {
                editorRef.current.innerHTML = html;

                if (savedRange) {
                    try {
                        selection.removeAllRanges();
                        selection.addRange(savedRange);
                    } catch (e) {
                        const range = document.createRange();
                        range.selectNodeContents(editorRef.current);
                        range.collapse(false);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            }
        }

        onChange?.(html);

        try {
            localStorage.setItem(`${storageKey}-content`, html);
        } catch (e) {
            console.error('Error saving content to localStorage:', e);
        }

        // Update active formatting after content change
        updateActiveFormatting();
    };

    const shouldShowPlugin = (plugin) => {
        if (plugin.tag) {
            return allowedTags.includes(plugin.tag);
        }
        return true;
    };

    const handlePluginAction = (plugin) => {
        if (editorRef.current && document.activeElement !== editorRef.current) {
            editorRef.current.focus();
        }

        const selection = window.getSelection()?.toString();

        // 1️⃣ If plugin defines a new HTML tag (non-technical users can just provide { tag: 'mark' })
        if (plugin.tag && selection) {
            const html = `<${plugin.tag}>${selection}</${plugin.tag}>`;
            document.execCommand("insertHTML", false, html);
        }
        // 2️⃣ If plugin defines a built-in command
        else if (plugin.cmd) {
            exec(plugin.cmd, plugin.arg || null);
        }
        // 3️⃣ If plugin defines a custom function
        else if (typeof plugin.action === "function") {
            plugin.action(editorRef.current);
        }
        // 4️⃣ If plugin defines a type like 'timestamp'
        else if (plugin.type === "timestamp") {
            const now = new Date().toLocaleString();
            document.execCommand("insertText", false, now);
        }

        handleChange();
    };

    useEffect(() => {
        if (editorRef.current) {
            try {
                localStorage.setItem(`${storageKey}-content`, editorRef.current.innerHTML);
            } catch (e) {
                console.error('Error saving content to localStorage:', e);
            }
        }
    }, [value, storageKey]);

    useEffect(() => {
        if (!storageKey) return;

        try {
            localStorage.setItem(`${storageKey}-allowedTags`, JSON.stringify(allowedTags));
        } catch (e) {
            console.error('Error saving allowed tags to localStorage:', e);
        }
    }, [allowedTags, storageKey]);

    useEffect(() => {
        if (editorRef.current && value !== undefined) {
            const sanitizedValue = sanitizeHTML(value, allowedTags);

            if (editorRef.current.innerHTML !== sanitizedValue) {
                isSettingContent.current = true;
                try {
                    editorRef.current.innerHTML = sanitizedValue;
                    if (isPreview) {
                        setPreviewContent(sanitizedValue);
                    }
                } finally {
                    isSettingContent.current = false;
                }
            }
        }
    }, [value, allowedTags, isPreview]);

    useEffect(() => {
        const updateFormattingState = () => {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const element = range.commonAncestorContainer.nodeType === 3
                    ? range.commonAncestorContainer.parentElement
                    : range.commonAncestorContainer;

                const blockElement = element.closest ? element.closest('h1, h2, h3, h4, h5, h6, p') : null;
                if (blockElement) {
                    setCurrentHeading(blockElement.tagName.toLowerCase());
                } else {
                    setCurrentHeading('p');
                }

                let currentElement = element;
                let fontSize = null;
                while (currentElement && currentElement !== editorRef.current) {
                    const computedStyle = window.getComputedStyle(currentElement);
                    if (computedStyle.fontSize && computedStyle.fontSize !== '') {
                        fontSize = computedStyle.fontSize;
                        break;
                    }
                    currentElement = currentElement.parentElement;
                }

                if (fontSize) {
                    setCurrentFontSize(fontSize);
                } else {
                    setCurrentFontSize('16px');
                }
            }
        };

        document.addEventListener('selectionchange', updateFormattingState);
        updateFormattingState();

        return () => {
            document.removeEventListener('selectionchange', updateFormattingState);
        };
    }, []);


    // Handle Enter key - FIXED to handle multiple consecutive Enter presses
    useEffect(() => {
        if (!editorRef.current) return;
        // Replace the entire handleKeyDown function with this updated version
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                // Check if we're in a list item
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const element = range.commonAncestorContainer.nodeType === 3
                        ? range.commonAncestorContainer.parentElement
                        : range.commonAncestorContainer;

                    const listItem = element.closest('li');
                    if (listItem) {
                        // Let browser handle Enter in lists
                        return;
                    }
                }

                // Prevent default behavior
                e.preventDefault();

                // Get the current selection
                const sel = window.getSelection();
                if (sel.rangeCount === 0) return;

                const range = sel.getRangeAt(0);

                // Create a new paragraph with a line break
                const newParagraph = document.createElement('p');
                const br = document.createElement('br');
                newParagraph.appendChild(br);

                // Insert the new paragraph after the current block
                const currentBlock = range.startContainer;
                let parentBlock = currentBlock;

                // Find the parent block element
                while (parentBlock && parentBlock !== editorRef.current) {
                    if (parentBlock.nodeType === 1 &&
                        (parentBlock.tagName === 'P' || parentBlock.tagName === 'DIV')) {
                        break;
                    }
                    parentBlock = parentBlock.parentNode;
                }

                // If we found a parent block, insert after it
                if (parentBlock && parentBlock !== editorRef.current) {
                    parentBlock.parentNode.insertBefore(newParagraph, parentBlock.nextSibling);
                } else {
                    // Otherwise, append to the editor
                    editorRef.current.appendChild(newParagraph);
                }

                // Move cursor to the new paragraph
                const newRange = document.createRange();
                newRange.setStart(newParagraph, 0);
                newRange.collapse(true);

                sel.removeAllRanges();
                sel.addRange(newRange);

                handleChange();
            }
        };

        if (editorRef.current) {
            editorRef.current.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [allowedTags]);

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor) return;

        const handleImageClick = (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
                e.stopPropagation();

                document.querySelectorAll('.rte-editor img').forEach(img => {
                    img.classList.remove('selected-image');
                });

                e.target.classList.add('selected-image');
                setSelectedImage(e.target);
                openImageEditor(e.target);
                updateOverlay(e.target);
            }
        };

        const handleEditorClick = (e) => {
            if (e.target === editor) {
                document.querySelectorAll('.rte-editor img').forEach(img => {
                    img.classList.remove('selected-image');
                });
                setSelectedImage(null);
                setOverlayStyle(prev => ({ ...prev, display: 'none' }));
            }
        };

        editor.addEventListener('click', handleImageClick);
        editor.addEventListener('click', handleEditorClick);
        return () => {
            if (editor) {
                editor.removeEventListener('click', handleImageClick);
                editor.removeEventListener('click', handleEditorClick);
            }
        };
    }, []);

    const updateOverlay = (img) => {
        if (!img || !editorContainerRef.current) return;

        const imgRect = img.getBoundingClientRect();
        const containerRect = editorContainerRef.current.getBoundingClientRect();

        setOverlayStyle({
            display: 'block',
            left: imgRect.left - containerRect.left,
            top: imgRect.top - containerRect.top,
            width: imgRect.width,
            height: imgRect.height
        });
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing || !selectedImage) return;

            const deltaX = e.clientX - resizeData.startX;
            const deltaY = e.clientY - resizeData.startY;

            let newWidth = resizeData.startWidth;
            let newHeight = resizeData.startHeight;

            if (resizeData.handle === 'se' || resizeData.handle === 'e' || resizeData.handle === 'ne') {
                newWidth = Math.max(20, resizeData.startWidth + deltaX);
            }
            if (resizeData.handle === 'se' || resizeData.handle === 's' || resizeData.handle === 'sw') {
                newHeight = Math.max(20, resizeData.startHeight + deltaY);
            }

            if (imageProps.lockAspectRatio) {
                if (resizeData.handle === 'se' || resizeData.handle === 's' || resizeData.handle === 'e') {
                    const ratio = resizeData.startWidth / resizeData.startHeight;
                    if (resizeData.handle === 'e') {
                        newHeight = newWidth / ratio;
                    } else if (resizeData.handle === 's') {
                        newWidth = newHeight * ratio;
                    } else {
                        if (Math.abs(deltaX) > Math.abs(deltaY)) {
                            newHeight = newWidth / ratio;
                        } else {
                            newWidth = newHeight * ratio;
                        }
                    }
                }
            }

            selectedImage.style.width = `${newWidth}px`;
            selectedImage.style.height = `${newHeight}px`;

            updateOverlay(selectedImage);

            setImageProps(prev => ({
                ...prev,
                width: `${newWidth}px`,
                height: `${newHeight}px`
            }));

            handleChange();
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, selectedImage, resizeData, imageProps.lockAspectRatio]);

    const openImageEditor = (img) => {
        const ratio = img.naturalWidth / img.naturalHeight;
        setAspectRatio(ratio);

        const computedStyle = window.getComputedStyle(img);

        setImageProps({
            width: img.style.width || computedStyle.width,
            height: img.style.height || computedStyle.height,
            alignment: getImageAlignment(img),
            borderWidth: img.style.borderWidth || computedStyle.borderWidth,
            borderStyle: img.style.borderStyle || computedStyle.borderStyle,
            borderColor: img.style.borderColor || rgbToHex(computedStyle.borderColor),
            borderRadius: img.style.borderRadius || computedStyle.borderRadius,
            margin: img.style.margin || computedStyle.margin,
            altText: img.alt || '',
            lockAspectRatio: true
        });

        setShowImageEditor(true);
    };

    const getImageAlignment = (img) => {
        if (img.style.float === 'left') return 'left';
        if (img.style.float === 'right') return 'right';
        if (img.style.display === 'block' && img.style.margin === '0 auto') return 'center';
        return '';
    };

    const rgbToHex = (rgb) => {
        if (!rgb || rgb.indexOf('rgb') !== 0) return '#000000';

        const values = rgb.match(/\d+/g);
        if (!values || values.length < 3) return '#000000';

        return '#' + values.slice(0, 3).map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    };

    const handleImagePropChange = (prop, value) => {
        setImageProps(prev => {
            const newProps = { ...prev, [prop]: value };

            if (prop === 'width' && prev.lockAspectRatio) {
                const width = parseInt(value) || 0;
                if (width > 0) {
                    const height = Math.round(width / aspectRatio);
                    newProps.height = `${height}px`;
                }
            } else if (prop === 'height' && prev.lockAspectRatio) {
                const height = parseInt(value) || 0;
                if (height > 0) {
                    const width = Math.round(height * aspectRatio);
                    newProps.width = `${width}px`;
                }
            }

            return newProps;
        });
    };

    const applyImageChanges = () => {
        if (!selectedImage) return;

        selectedImage.style.width = imageProps.width;
        selectedImage.style.height = imageProps.height;
        selectedImage.style.borderWidth = imageProps.borderWidth;
        selectedImage.style.borderStyle = imageProps.borderStyle;
        selectedImage.style.borderColor = imageProps.borderColor;
        selectedImage.style.borderRadius = imageProps.borderRadius;
        selectedImage.style.margin = imageProps.margin;
        selectedImage.alt = imageProps.altText;

        if (imageProps.alignment === 'left') {
            selectedImage.style.float = 'left';
            selectedImage.style.display = '';
            selectedImage.style.margin = imageProps.margin || '0 10px 10px 0';
        } else if (imageProps.alignment === 'right') {
            selectedImage.style.float = 'right';
            selectedImage.style.display = '';
            selectedImage.style.margin = imageProps.margin || '0 0 10px 10px';
        } else if (imageProps.alignment === 'center') {
            selectedImage.style.float = '';
            selectedImage.style.display = 'block';
            selectedImage.style.margin = imageProps.margin || '10px auto';
        } else {
            selectedImage.style.float = '';
            selectedImage.style.display = '';
            selectedImage.style.margin = imageProps.margin || '10px 0';
        }

        updateOverlay(selectedImage);
        handleChange();
        setShowImageEditor(false);
    };

    const removeImage = () => {
        if (selectedImage) {
            selectedImage.remove();
            handleChange();
            setOverlayStyle(prev => ({ ...prev, display: 'none' }));
        }
        setShowImageEditor(false);
    };

    const cleanWordHTML = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const wordElements = tempDiv.querySelectorAll('o\\:p, o\\:smarttagtype, o\\:is, o\\:link, o\\:lock, o\\:release, o\\:OLEObjectShape, o\\:OLEObjectElement, o\\:OLEObjectEmbed, o\\:OLEObjectLink, o\\:OLEObjectInk, o\\:OLEObjectScript, o\\:OLEObjectUnknown, o\\:OLEObjectControl, o\\:OLEObject');
        wordElements.forEach(el => el.remove());

        const wordHeadings = tempDiv.querySelectorAll('[style*="mso-heading"]');
        wordHeadings.forEach(el => {
            const level = el.style['mso-heading'] || el.getAttribute('mso-heading');
            let headingTag = 'p';

            if (level) {
                const levelNum = parseInt(level.replace(/\D/g, ''));
                if (levelNum >= 1 && levelNum <= 6) {
                    headingTag = `h${levelNum}`;
                }
            }

            const newHeading = document.createElement(headingTag);
            newHeading.innerHTML = el.innerHTML;
            newHeading.className = el.className;
            el.parentNode.replaceChild(newHeading, el);
        });

        const spans = tempDiv.querySelectorAll('span');
        spans.forEach(span => {
            if (span.attributes.length === 0 ||
                (span.attributes.length === 1 && span.getAttribute('style') === '')) {
                const parent = span.parentNode;
                while (span.firstChild) {
                    parent.insertBefore(span.firstChild, span);
                }
                parent.removeChild(span);
            }
        });

        const allElements = tempDiv.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.getAttribute('class') === '') {
                el.removeAttribute('class');
            }
            if (el.getAttribute('style') === '') {
                el.removeAttribute('style');
            }

            if (el.style) {
                el.style.margin = '';
                el.style.padding = '';
                el.style.border = '';
                el.style.background = '';
                el.style.fontFamily = '';
                el.style.fontSize = '';
                el.style.color = '';
                el.style.lineHeight = '';
            }
        });

        return tempDiv.innerHTML;
    };

    useEffect(() => {
        if (!editorRef.current) return;

        const handlePaste = (e) => {
            e.preventDefault();
            const clipboardData = e.clipboardData || window.clipboardData;
            const pastedData = clipboardData.getData('text/html');

            if (pastedData) {
                let cleanedData = cleanWordHTML(pastedData);
                cleanedData = sanitizeHTML(cleanedData, allowedTags);
                document.execCommand('insertHTML', false, cleanedData);
                handleChange();
            } else {
                const text = clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text);
                handleChange();
            }
        };

        if (editorRef.current) {
            editorRef.current.addEventListener('paste', handlePaste);
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.removeEventListener('paste', handlePaste);
            }
        };
    }, [allowedTags]);

    const handleSearch = (query) => {
        setSearchQuery(query);

        if (!query || !editorRef.current) {
            clearHighlights();
            setSearchResults([]);
            setCurrentSearchIndex(-1);
            setSearchCount(0);
            return;
        }

        clearHighlights();

        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const editorContent = editorRef.current.innerHTML;
        const regex = new RegExp(escapedQuery, 'gi');

        let highlightedHTML = editorContent.replace(regex, '<span class="search-highlight">$&</span>');
        editorRef.current.innerHTML = highlightedHTML;

        const highlightedElements = editorRef.current.querySelectorAll('.search-highlight');
        const count = highlightedElements.length;

        setSearchCount(count);
        setSearchResults(Array.from(highlightedElements));

        if (count > 0) {
            setCurrentSearchIndex(0);
            highlightedElements[0].classList.add('search-highlight-current');
            setTimeout(() => {
                highlightedElements[0].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 100);
        } else {
            setCurrentSearchIndex(-1);
        }

        handleChange();
    };

    const clearHighlights = () => {
        if (!editorRef.current) return;

        const highlights = editorRef.current.querySelectorAll('.search-highlight, .search-highlight-current');

        if (highlights.length === 0) return;

        highlights.forEach(highlight => {
            if (!highlight || !highlight.parentNode) return;

            const textNode = document.createTextNode(highlight.textContent);
            highlight.parentNode.replaceChild(textNode, highlight);
        });

        editorRef.current.normalize();
        handleChange();
    };

    const highlightCurrentMatch = (index) => {
        if (!editorRef.current) return;

        const allHighlights = editorRef.current.querySelectorAll('.search-highlight');

        if (allHighlights.length === 0) return;

        allHighlights.forEach(el => {
            if (el && el.classList) {
                el.classList.remove('search-highlight-current');
            }
        });

        if (index >= 0 && index < allHighlights.length) {
            const currentHighlight = allHighlights[index];
            if (currentHighlight && currentHighlight.classList) {
                currentHighlight.classList.add('search-highlight-current');

                setTimeout(() => {
                    if (currentHighlight) {
                        currentHighlight.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }, 100);
            }
        }
    };

    const goToNextMatch = () => {
        if (searchResults.length === 0) return;

        const nextIndex = (currentSearchIndex + 1) % searchResults.length;
        setCurrentSearchIndex(nextIndex);
        highlightCurrentMatch(nextIndex);
    };

    const goToPrevMatch = () => {
        if (searchResults.length === 0) return;

        const prevIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
        setCurrentSearchIndex(prevIndex);
        highlightCurrentMatch(prevIndex);
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (!showSearch) {
            setTimeout(() => {
                const searchInput = document.querySelector('.search-input');
                if (searchInput) searchInput.focus();
            }, 100);
        } else {
            setSearchQuery("");
            setSearchResults([]);
            setCurrentSearchIndex(-1);
            setSearchCount(0);
            clearHighlights();
        }
    };

    const applyFontFamily = (fontFamily) => {
        const selection = window.getSelection();

        if (selection.rangeCount === 0) {
            const range = document.createRange();
            const editor = editorRef.current;

            if (editor) {
                range.selectNodeContents(editor);
                range.collapse(false);

                const span = document.createElement('span');
                span.style.fontFamily = fontFamily;
                span.innerHTML = '\u200B';

                range.insertNode(span);

                range.setStart(span, 1);
                range.setEnd(span, 1);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        } else {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();

            if (selectedText) {
                const span = document.createElement('span');
                span.style.fontFamily = fontFamily;

                try {
                    range.surroundContents(span);
                } catch (e) {
                    const contents = range.extractContents();
                    span.appendChild(contents);
                    range.insertNode(span);
                }
            } else {
                const span = document.createElement('span');
                span.style.fontFamily = fontFamily;
                span.innerHTML = '\u200B';
                range.insertNode(span);

                range.setStart(span, 1);
                range.setEnd(span, 1);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }

        handleChange();
    };

    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            return selection.getRangeAt(0).cloneRange();
        }
        return null;
    };

    const restoreSelection = (savedRange) => {
        if (savedRange) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(savedRange);
        }
    };

    const ensureEditorFocused = () => {
        const savedSelection = saveSelection();
        const isFocused = document.activeElement === editorRef.current;

        if (!isFocused) {
            editorRef.current.focus();
            restoreSelection(savedSelection);
        }
    };

    const applyBlockquote = () => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        const container = range.commonAncestorContainer;
        const element = container.nodeType === 3 ? container.parentNode : container;
        const existingBlockquote = element.closest('blockquote');

        if (existingBlockquote) {
            const parent = existingBlockquote.parentNode;
            while (existingBlockquote.firstChild) {
                parent.insertBefore(existingBlockquote.firstChild, existingBlockquote);
            }
            parent.removeChild(existingBlockquote);
        } else {
            const newBlockquote = document.createElement('blockquote');

            if (selectedText) {
                const quote = document.createElement('p');
                quote.textContent = selectedText;
                newBlockquote.appendChild(quote);

                const citationElement = document.createElement('cite');
                citationElement.contentEditable = true;
                citationElement.textContent = '— Source';
                citationElement.style.display = 'block';
                citationElement.style.marginTop = '6px';
                citationElement.style.marginBottom = '8px';
                citationElement.style.fontStyle = 'normal';
                citationElement.style.color = '#888';
                newBlockquote.appendChild(citationElement);

                range.deleteContents();
                range.insertNode(newBlockquote);

                const newRange = document.createRange();
                newRange.selectNodeContents(citationElement);
                newRange.collapse(false);

                selection.removeAllRanges();
                selection.addRange(newRange);
            } else {
                const quote = document.createElement('p');
                quote.innerHTML = '&nbsp;';
                newBlockquote.appendChild(quote);

                const citationElement = document.createElement('cite');
                citationElement.contentEditable = true;
                citationElement.textContent = '— Source';
                citationElement.style.display = 'block';
                citationElement.style.marginTop = '8px';
                citationElement.style.fontStyle = 'normal';
                citationElement.style.color = '#888';
                newBlockquote.appendChild(citationElement);

                range.insertNode(newBlockquote);

                const newRange = document.createRange();
                newRange.selectNodeContents(quote);
                newRange.collapse(true);

                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }

        handleChange();
    };

    const applyTextColor = (color) => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (selectedText) {
            const span = document.createElement('span');
            span.style.color = color;
            span.textContent = selectedText;

            range.deleteContents();
            range.insertNode(span);

            range.setStartAfter(span);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            const span = document.createElement('span');
            span.style.color = color;
            span.innerHTML = '\u200B';

            range.insertNode(span);

            range.setStart(span, 1);
            range.setEnd(span, 1);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        handleChange();
    };

    const toggleFormatting = (command, tagName) => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        // Get the start and end containers of the selection
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;

        // Find the closest block-level elements for both start and end
        const getBlockParent = (node) => {
            let parent = node.nodeType === 3 ? node.parentNode : node;
            while (parent && parent !== editorRef.current) {
                if (['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'LI'].includes(parent.tagName)) {
                    return parent;
                }
                parent = parent.parentNode;
            }
            return parent;
        };

        const startBlock = getBlockParent(startContainer);
        const endBlock = getBlockParent(endContainer);

        // If selection spans multiple blocks, handle each block separately
        if (startBlock !== endBlock) {
            // Save the current selection
            const savedRange = range.cloneRange();

            // Process each block in the selection
            let currentBlock = startBlock;
            while (currentBlock && currentBlock !== endBlock.nextSibling) {
                if (currentBlock.nodeType === 1 && ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'LI'].includes(currentBlock.tagName)) {
                    // Create a range for this block
                    const blockRange = document.createRange();
                    blockRange.selectNodeContents(currentBlock);

                    // Apply formatting to this block
                    const blockSelection = window.getSelection();
                    blockSelection.removeAllRanges();
                    blockSelection.addRange(blockRange);

                    // Apply the formatting
                    document.execCommand(command, false, null);
                }
                currentBlock = currentBlock.nextSibling;
            }

            // Restore the original selection
            const restoredSelection = window.getSelection();
            restoredSelection.removeAllRanges();
            restoredSelection.addRange(savedRange);
        } else {
            // For single block selection, use the original logic
            if (selectedText) {
                // Check if the selection is already formatted
                const container = range.commonAncestorContainer;
                let element = container.nodeType === 3 ? container.parentNode : container;

                let isFormatted = false;
                while (element && element !== editorRef.current) {
                    if (element.tagName === tagName) {
                        isFormatted = true;
                        break;
                    }
                    element = element.parentNode;
                }

                if (isFormatted) {
                    // Remove formatting by unwrapping the tag
                    const formattedElement = selection.focusNode.parentNode;
                    if (formattedElement.tagName === tagName) {
                        const parent = formattedElement.parentNode;
                        while (formattedElement.firstChild) {
                            parent.insertBefore(formattedElement.firstChild, formattedElement);
                        }
                        parent.removeChild(formattedElement);
                    }
                } else {
                    // Apply formatting only to the selected text
                    const formattedElement = document.createElement(tagName);
                    formattedElement.textContent = selectedText;

                    range.deleteContents();
                    range.insertNode(formattedElement);

                    // Move cursor after the formatted element
                    range.setStartAfter(formattedElement);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            } else {
                // For empty selection, toggle the formatting state
                const isFormatted = document.queryCommandState(command);

                if (isFormatted) {
                    // Remove formatting
                    document.execCommand(command, false, null);
                } else {
                    // Apply formatting
                    document.execCommand(command, false, null);
                }
            }
        }

        handleChange();
        updateActiveFormatting();
    };

    const toggleBold = () => {
        toggleFormatting('bold', 'STRONG');
    };

    const toggleItalic = () => {
        toggleFormatting('italic', 'EM');
    };

    const toggleUnderline = () => {
        toggleFormatting('underline', 'U');
    };

    const toggleStrikethrough = () => {
        toggleFormatting('strikeThrough', 'S');
    };

    const exec = (cmd, arg = null) => {
        if (!editorRef.current) return;

        const savedSelection = saveSelection();
        const isCurrentlyFocused = document.activeElement === editorRef.current;

        if (!isCurrentlyFocused) {
            editorRef.current.focus();
            restoreSelection(savedSelection);
        }

        if (cmd === "formatBlock" && arg === "blockquote") {
            applyBlockquote();
            return;
        }

        if (cmd === "formatBlock") {
            const cleanArg = arg ? arg.replace(/[<>]/g, '') : arg;
            document.execCommand(cmd, false, cleanArg);
            handleChange();
            return;
        }

        if (cmd === "bold") {
            toggleBold();
            return;
        }

        if (cmd === "italic") {
            toggleItalic();
            return;
        }

        if (cmd === "underline") {
            toggleUnderline();
            return;
        }

        if (cmd === "strikeThrough") {
            toggleStrikethrough();
            return;
        }

        if (cmd === "createLink") {
            const url = prompt("Enter URL:");
            if (url) {
                document.execCommand("createLink", false, url);
                const sel = window.getSelection();
                const anchor = sel.anchorNode?.parentElement;
                if (anchor && anchor.tagName === "A") {
                    anchor.setAttribute("target", "_blank");
                    anchor.setAttribute("rel", "noopener noreferrer");
                }
            }
            handleChange();
            return;
        }

        if (cmd === "insertImage") {
            savedSelectionRef.current = savedSelection;
            fileRef.current?.click();
            return;
        }

        if (cmd === "insertEmoji") {
            savedEmojiSelectionRef.current = savedSelection;
            setShowEmojiPicker((v) => !v);
            return;
        }

        if (cmd === "toggleHTML") {
            const isCodeView = editorRef.current.getAttribute("data-code-view") === "true";

            if (isCodeView) {
                const code = editorRef.current.innerText;
                const sanitizedCode = sanitizeHTML(code, allowedTags);
                editorRef.current.innerHTML = sanitizedCode;
                editorRef.current.setAttribute("data-code-view", "false");
                editorRef.current.contentEditable = true;
            } else {
                const html = editorRef.current.innerHTML;
                editorRef.current.innerText = html;
                editorRef.current.setAttribute("data-code-view", "true");
                editorRef.current.contentEditable = true;
            }

            handleChange();
            return;
        }

        if (cmd === "cut") {
            const selection = window.getSelection();
            const selectedText = selection.toString();
            if (!selectedText) return;
            navigator.clipboard
                .writeText(selectedText)
                .then(() => {
                    document.execCommand("delete");
                    handleChange();
                })
                .catch((err) => console.error("Cut failed:", err));
            return;
        }

        if (cmd === "copy") {
            const selection = window.getSelection();
            const selectedText = selection.toString();
            const textToCopy = selectedText || editorRef.current.innerText;
            navigator.clipboard
                .writeText(textToCopy)
                .then(() => alert("Copied to clipboard!"))
            return;
        }

        if (cmd === "unlink") {
            document.execCommand("unlink", false, null);
            handleChange();
            return;
        }

        if (cmd === "justifyLeft" || cmd === "justifyCenter" || cmd === "justifyRight") {
            document.execCommand(cmd, false, null);
            handleChange();
            return;
        }

        if (cmd === "paste") {
            navigator.clipboard.readText().then((text) => {
                document.execCommand("insertText", false, text);
                handleChange();
            });
            return;
        }

        if (cmd === "removeText") {
            const selection = window.getSelection();
            if (selection.toString()) {
                selection.deleteFromDocument();
                handleChange();
            }
            return;
        }

        if (cmd === "textColor") {
            savedSelectionRef.current = savedSelection;
            colorInputRef.current.click();
            return;
        }

        if (cmd === "highlight") {
            savedSelectionRef.current = savedSelection;
            highlightColorRef.current.click();
            return;
        }

        if (cmd === "insertTableGrid") {
            savedTableSelectionRef.current = savedSelection;
            setShowTableGrid((v) => !v);
            return;
        }

        if (cmd === "insertUnorderedList" || cmd === "insertOrderedList") {
            try {
                document.execCommand(cmd);
                handleChange();
            } catch (error) {
                console.error(`Error executing ${cmd}:`, error);
            }
            return;
        }

        if (cmd === "unorderedListStyle" || cmd === "orderedListStyle") {
            const isUnordered = cmd === "unorderedListStyle";
            const listTag = isUnordered ? "ul" : "ol";
            const list = window.getSelection()?.anchorNode?.closest(listTag);

            if (list) {
                list.style.listStyleType = arg;
                list.style.paddingLeft = "1.5rem";
            }
            handleChange();
            return;
        }

        if (cmd === "toUpperCase" || cmd === "toLowerCase") {
            const selection = window.getSelection();
            const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
            const selectedText = range?.toString();

            if (selectedText) {
                const transformed =
                    cmd === "toUpperCase"
                        ? selectedText.toUpperCase()
                        : selectedText.toLowerCase();

                range.deleteContents();
                range.insertNode(document.createTextNode(transformed));
            } else if (editorRef.current) {
                const html = editorRef.current.innerHTML;
                editorRef.current.innerHTML =
                    cmd === "toUpperCase" ? html.toUpperCase() : html.toLowerCase();
            }
            handleChange();
            return;
        }

        if (cmd === "insertHorizontalRule") {
            document.execCommand("insertHorizontalRule", false, null);
            handleChange();
            return;
        }

        if (cmd === "fontName") {
            applyFontFamily(arg);
            return;
        }

        document.execCommand(cmd, false, arg);
        handleChange();
    };

    const insertTable = (rows, cols) => {
        let tableHTML = "<table style='border-collapse: collapse; width: 100%;'>";
        for (let i = 0; i < rows; i++) {
            tableHTML += "<tr>";
            for (let j = 0; j < cols; j++) {
                tableHTML +=
                    "<td style='border: 1px solid #999; padding: 8px; min-width: 60px;'>&nbsp;</td>";
            }
            tableHTML += "</tr>";
        }
        tableHTML += "</table><br/>";

        if (savedTableSelectionRef.current) {
            restoreSelection(savedTableSelectionRef.current);
            savedTableSelectionRef.current = null;
        }

        document.execCommand("insertHTML", false, tableHTML);
        handleChange();
    };

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const base64 = ev.target.result;

            if (savedSelectionRef.current) {
                restoreSelection(savedSelectionRef.current);
                savedSelectionRef.current = null;
            }

            document.execCommand("insertImage", false, base64);
            const imgs = editorRef.current.querySelectorAll("img");
            const last = imgs[imgs.length - 1];
            if (last) {
                Object.assign(last.style, {
                    objectFit: "cover",
                    maxWidth: "100%",
                    borderRadius: "8px",
                    margin: "8px 0",
                    display: "block",
                });
            }
            handleChange();
        };
        reader.readAsDataURL(f);
        e.target.value = "";
    };

    const selectionElement = () => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return null;
        const node = sel.anchorNode;
        if (!node) return null;
        return node.nodeType === 3 ? node.parentElement : node;
    };

    const changeUnorderedListStyle = (style) => {
        try {
            const el = selectionElement();
            const insideUL = el?.closest?.("ul");
            if (!insideUL) {
                document.execCommand("insertUnorderedList");
                setTimeout(() => {
                    const newEl = selectionElement();
                    const list = newEl?.closest?.("ul") || editorRef.current?.querySelector("ul");
                    if (list) {
                        list.style.listStyleType = style || "disc";
                        list.style.paddingLeft = "1.5rem";
                    }
                    handleChange();
                }, 10);
            } else {
                insideUL.style.listStyleType = style || "disc";
                handleChange();
            }
        } catch (error) {
            console.error("Error changing unordered list style:", error);
        }
    };

    const changeOrderedListStyle = (style) => {
        try {
            const el = selectionElement();
            const insideOL = el?.closest?.("ol");
            if (!insideOL) {
                document.execCommand("insertOrderedList");
                setTimeout(() => {
                    const newEl = selectionElement();
                    const list = newEl?.closest?.("ol") || editorRef.current?.querySelector("ol");
                    if (list) {
                        list.style.listStyleType = style || "decimal";
                        list.style.paddingLeft = "1.5rem";
                    }
                    handleChange();
                }, 10);
            } else {
                insideOL.style.listStyleType = style || "decimal";
                handleChange();
            }
        } catch (error) {
            console.error("Error changing ordered list style:", error);
        }
    };

    return (
        <div
            ref={editorContainerRef}
            className={`rte-container ${focused ? "rte-focused" : ""} ${height === "auto" ? "" :
                height === "responsive" ? "" :
                    typeof height === "number" ? "fixed-height" : ""
                } ${width === "auto" ? "" :
                    width === "responsive" ? "" :
                        typeof width === "number" ? "fixed-width" : ""
                } ${className} theme-${theme}`}
            style={{
                ...(typeof height === "number" ? { height: `${height}px` } : {}),
                ...(typeof width === "number" ? { width: `${width}px` } : {}),
                minHeight: `${minHeight}px`
            }}
        >

            {showImageEditor && (
                <div className={`image-editor-modal ${theme}`}>
                    <div className="image-editor-content">
                        <div className="editor-flex">
                            <h3>Edit Image</h3>
                            <button
                                className="image-editor-close-btn"
                                onClick={() => setShowImageEditor(false)}
                                aria-label="Close"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="image-editor-row">
                            <div className="image-editor-col">
                                <label>Width (px)</label>
                                <input
                                    type="number"
                                    value={parseInt(imageProps.width) || ''}
                                    onChange={(e) => handleImagePropChange('width', `${e.target.value}px`)}
                                />
                            </div>
                            <div className="image-editor-col">
                                <label>Height (px)</label>
                                <input
                                    type="number"
                                    value={parseInt(imageProps.height) || ''}
                                    onChange={(e) => handleImagePropChange('height', `${e.target.value}px`)}
                                />
                            </div>
                            <div className="image-editor-col">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={imageProps.lockAspectRatio}
                                        onChange={(e) => handleImagePropChange('lockAspectRatio', e.target.checked)}
                                    />
                                    Lock Ratio
                                </label>
                            </div>
                        </div>

                        <div className="image-editor-row">
                            <div className="image-editor-col">
                                <label>Alignment</label>
                                <select
                                    value={imageProps.alignment}
                                    onChange={(e) => handleImagePropChange('alignment', e.target.value)}
                                >
                                    <option value="">None</option>
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                            <div className="image-editor-col">
                                <label>Margin (px)</label>
                                <input
                                    type="text"
                                    value={imageProps.margin}
                                    onChange={(e) => handleImagePropChange('margin', e.target.value)}
                                    placeholder="e.g. 10px"
                                />
                            </div>
                        </div>

                        <div className="image-editor-row">
                            <div className="image-editor-col">
                                <label>Border Width (px)</label>
                                <input
                                    type="number"
                                    value={parseInt(imageProps.borderWidth) || ''}
                                    onChange={(e) => handleImagePropChange('borderWidth', `${e.target.value}px`)}
                                />
                            </div>
                            <div className="image-editor-col">
                                <label>Border Style</label>
                                <select
                                    value={imageProps.borderStyle}
                                    onChange={(e) => handleImagePropChange('borderStyle', e.target.value)}
                                >
                                    <option value="none">None</option>
                                    <option value="solid">Solid</option>
                                    <option value="dashed">Dashed</option>
                                    <option value="dotted">Dotted</option>
                                    <option value="double">Double</option>
                                </select>
                            </div>
                            <div className="image-editor-col">
                                <label>Border Color</label>
                                <input
                                    type="color"
                                    value={imageProps.borderColor}
                                    onChange={(e) => handleImagePropChange('borderColor', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="image-editor-row">
                            <div className="image-editor-col">
                                <label>Border Radius (px)</label>
                                <input
                                    type="text"
                                    value={imageProps.borderRadius}
                                    onChange={(e) => handleImagePropChange('borderRadius', e.target.value)}
                                    placeholder="e.g. 8px"
                                />
                            </div>
                            <div className="image-editor-col">
                                <label>Alt Text</label>
                                <input
                                    type="text"
                                    value={imageProps.altText}
                                    onChange={(e) => handleImagePropChange('altText', e.target.value)}
                                    placeholder="Image description"
                                />
                            </div>
                        </div>

                        <div className="image-editor-actions">
                            <button onClick={applyImageChanges}>Apply Changes</button>
                            <button onClick={() => setShowImageEditor(false)}>Cancel</button>
                            <button onClick={removeImage} className="remove-btn">Remove Image</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Single toolbar row with all tools */}
            <div className={`rte-toolbar ${theme}`}>
                {toolbarButtons.map((b, i) => {
                    if (b.type === "dropdown") {
                        const filteredOptions = b.options.filter(opt =>
                            opt.value === 'p' || allowedTags.includes(opt.value)
                        );

                        return (
                            <select
                                key={i}
                                className="list-style-dropdown rte-btn"
                                title={b.cmd}
                                onChange={(e) => exec(b.cmd, e.target.value)}
                                value={currentHeading}
                            >
                                {filteredOptions.map((opt, j) => (
                                    <option key={j} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        );
                    }

                    if (!shouldShowButton(b.cmd, allowedTags)) return null;

                    if (b.cmd === "insertTableGrid") {
                        return (
                            <div key={i} className="table-grid-wrapper">
                                <button
                                    type="button"
                                    className={`rte-btn ${activeFormatting[b.cmd] ? 'active' : ''}`}
                                    onClick={() => exec(b.cmd, b.arg)}
                                    title={b.tooltip}
                                >
                                    {b.icon}
                                </button>
                                {showTableGrid && (
                                    <div className={`table-grid-popup ${theme}`} onMouseLeave={() => setShowTableGrid(false)}>
                                        {[...Array(10)].map((_, r) => (
                                            <div key={r} className="grid-row">
                                                {[...Array(10)].map((_, c) => {
                                                    const active = r < gridSize.rows && c < gridSize.cols;
                                                    return (
                                                        <div
                                                            key={c}
                                                            className={`grid-cell ${active ? "active" : ""}`}
                                                            onMouseEnter={() => setGridSize({ rows: r + 1, cols: c + 1 })}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                insertTable(r + 1, c + 1);
                                                                setShowTableGrid(false);
                                                                setGridSize({ rows: 0, cols: 0 });
                                                            }}
                                                        ></div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                        <div className="grid-size-label">
                                            {gridSize.rows} × {gridSize.cols}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }

                    if (b.cmd === "insertEmoji") {
                        return (
                            <div
                                key={i}
                                className="emoji-wrapper"
                                onMouseLeave={() => setShowEmojiPicker(false)}
                            >
                                <button
                                    type="button"
                                    className={`rte-btn ${activeFormatting[b.cmd] ? 'active' : ''}`}
                                    onClick={() => exec(b.cmd, b.arg)}
                                    title={b.tooltip}
                                >
                                    {b.icon}
                                </button>

                                {showEmojiPicker && (
                                    <div className={`emoji-picker-popup ${theme}`}>
                                        <EmojiPicker
                                            theme={theme === 'dark' ? 'dark' : 'light'}
                                            onEmojiClick={(emojiData) => {
                                                const emoji = emojiData.emoji;

                                                if (savedEmojiSelectionRef.current) {
                                                    restoreSelection(savedEmojiSelectionRef.current);
                                                    savedEmojiSelectionRef.current = null;
                                                }

                                                ensureEditorFocused();
                                                document.execCommand("insertText", false, emoji);
                                                setShowEmojiPicker(false);
                                                handleChange();
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    }

                    if (b.cmd === "search") {
                        return (
                            <button
                                key={i}
                                type="button"
                                className="rte-btn"
                                title={b.tooltip}
                                onClick={toggleSearch}
                            >
                                {b.icon}
                            </button>
                        );
                    }

                    return (
                        <button
                            key={i}
                            type="button"
                            className={`rte-btn ${activeFormatting[b.cmd] ? 'active' : ''}`}
                            title={b.tooltip}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => exec(b.cmd, b.arg)}
                        >
                            {b.icon}
                        </button>
                    );
                })}

                {/* Theme toggle button */}
                <button
                    type="button"
                    className="rte-btn"
                    title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
                    onClick={toggleTheme}
                >
                    {theme === 'light' ? <FaMoon /> : <FaSun />}
                </button>

                <TagSelector
                    allowedTags={allowedTags}
                    setAllowedTags={setAllowedTags}
                    showTagSelector={showTagSelector}
                    setShowTagSelector={setShowTagSelector}
                    theme={theme}
                    allTags={allTags}
                />

                {allowedTags.includes('ul') && (
                    <>

                        <button
                            type="button"
                            className={`rte-btn ${activeFormatting.insertUnorderedList ? 'active' : ''}`}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                exec("insertUnorderedList");
                            }}
                            title="insert unordered list"
                        >
                            <FaListUl />
                        </button>
                        <Dropdown
                            options={unorderedListOptions}
                            value={null}
                            onChange={(value) => changeUnorderedListStyle(value)}
                            placeholder=""
                            width="100px"
                            theme={theme}
                        />
                    </>
                )}



                {/* // Update the ordered list (ol) button to prevent event propagation: */}
                {allowedTags.includes('ol') && (
                    <>
                        <button
                            type="button"
                            className={`rte-btn ${activeFormatting.insertOrderedList ? 'active' : ''}`}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                exec("insertOrderedList");
                            }}
                            title="insert ordered list"
                        >
                            <FaListOl />
                        </button>
                        <Dropdown
                            options={orderedListOptions}
                            value={null}
                            onChange={(value) => changeOrderedListStyle(value)}
                            placeholder=""
                            width="100px"
                            theme={theme}
                        />
                    </>
                )}

                <input
                    ref={colorInputRef}
                    type="color"
                    className="color-picker"
                    onChange={(e) => {
                        if (savedSelectionRef.current) {
                            restoreSelection(savedSelectionRef.current);
                            savedSelectionRef.current = null;
                        }
                        applyTextColor(e.target.value);
                    }}
                />
                <input
                    ref={highlightColorRef}
                    type="color"
                    className="color-picker"
                    onChange={(e) => {
                        if (savedSelectionRef.current) {
                            restoreSelection(savedSelectionRef.current);
                            savedSelectionRef.current = null;
                        }
                        document.execCommand("backColor", false, e.target.value);
                        handleChange();
                    }}
                />

                <button
                    type="button"
                    className="rte-btn"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsPreview((prev) => !prev);
                    }}
                    title={isPreview ? "Switch to Edit Mode" : "Switch to Preview Mode"}
                >
                    {isPreview ? <FaEdit /> : <FaEye />}
                </button>
            </div>

            {plugins.length > 0 && (
                <div className={`rte-toolbar rte-toolbar-plugins ${theme}`}>
                    {plugins.map((plugin, index) => {
                        if (!shouldShowPlugin(plugin)) {
                            return null;
                        }
                        return (
                            <button
                                key={index}
                                type="button"
                                className="rte-btn"
                                title={plugin.title}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handlePluginAction(plugin)}
                            >
                                {typeof plugin.icon === 'string' ? plugin.icon : plugin.icon}
                            </button>
                        );
                    })}
                </div>
            )}

            {showSearch && (
                <div className={`search-bar ${theme}`}>
                    <input
                        type="text"
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search in document..."
                    />
                    {searchCount > 0 && (
                        <span className="search-info">
                            {currentSearchIndex + 1} of {searchCount}
                        </span>
                    )}
                    {searchCount === 0 && searchQuery && (
                        <span className="search-info">
                            No results
                        </span>
                    )}
                    <button
                        className="search-btn"
                        onClick={goToPrevMatch}
                        disabled={searchCount === 0}
                        title="Previous match"
                    >
                        <FaChevronUp />
                    </button>
                    <button
                        className="search-btn"
                        onClick={goToNextMatch}
                        disabled={searchCount === 0}
                        title="Next match"
                    >
                        <FaChevronDown />
                    </button>
                    <button
                        className="search-btn close-btn"
                        onClick={toggleSearch}
                        title="Close search"
                    >
                        <FaTimes />
                    </button>
                </div>
            )}

            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

            {/* // Update the preview section in the return statement */}
            {!isPreview ? (
                <div
                    ref={editorRef}
                    className={`rte-editor ${theme}`}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
            ) : (
                <div className={`rte-preview ${theme}`}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: previewContent ? sanitizeHTML(previewContent, allowedTags) : "",
                        }}
                    />
                </div>
            )}
        </div>
    );
}