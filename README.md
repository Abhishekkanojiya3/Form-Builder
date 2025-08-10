# Dynamic Form Builder

A React-based form builder application that allows users to create, preview, and manage dynamic forms with advanced field types and validation rules.

## Features

- **Dynamic Form Creation**: Add and configure 7 different field types (Text, Number, Textarea, Select, Radio, Checkbox, Date)
- **Field Configuration**: Set labels, validation rules, default values, and required status
- **Derived Fields**: Auto-calculated fields based on parent field values (e.g., Age from Date of Birth)
- **Form Validation**: Real-time validation with custom rules including email format and password strength
- **Form Management**: Save, view, and manage all created forms
- **Live Preview**: Test forms exactly as end users would see them
- **Local Storage**: All data persisted locally, no backend required

## Tech Stack

- **React 19.1.1** - Frontend framework
- **Redux Toolkit** - State management
- **Material-UI (MUI)** - UI component library
- **React Router DOM** - Client-side routing
- **Day.js** - Date manipulation
- **Vite** - Build tool and development server
- **localStorage** - Data persistence

## Routes

- `/create` - Build new forms with field configuration
- `/preview` - Preview and test current form
- `/myforms` - View all saved forms

## Installation

```bash
npm install
npm run dev
```

## Usage

1. **Create Form**: Navigate to `/create` and add fields using the field type selector
2. **Configure Fields**: Click edit on any field to set validation rules and properties
3. **Preview Form**: Go to `/preview` to test the form with real validation
4. **Save Form**: Use the save button to store your form with a custom name
5. **Manage Forms**: Visit `/myforms` to view, edit, or delete saved forms

## Field Types

- **Text**: Single-line input with email/password validation
- **Number**: Numeric input with min/max constraints
- **Textarea**: Multi-line text input
- **Select**: Dropdown with custom options
- **Radio**: Single selection with radio buttons
- **Checkbox**: Boolean toggle
- **Date**: Date picker for birthdate, events, etc.

## Advanced Features

- **Derived Fields**: Fields that auto-calculate from other fields (Age from DOB, Full Name combination)
- **Validation Rules**: Email format, password strength, length limits, value ranges
- **Real-time Updates**: Derived fields update automatically when parent fields change
- **Form Persistence**: All forms saved to localStorage with creation timestamps
