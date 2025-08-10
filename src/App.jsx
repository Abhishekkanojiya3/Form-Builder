import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
import Layout from './components/common/Layout';
import Create from './pages/Create';
import Preview from './pages/Preview';
import MyForms from './pages/MyForms';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/create" replace />} />
              <Route path="/create" element={<Create />} />
              <Route path="/preview" element={<Preview />} />
              <Route path="/myforms" element={<MyForms />} />
            </Routes>
          </Layout>
      </ThemeProvider>
    </Provider>
  );
}

export default App;