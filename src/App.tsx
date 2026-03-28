import { Routes, Route } from 'react-router-dom'
import { ConfiguratorProvider } from './context/ConfiguratorContext'
import { PriceProvider } from './context/PriceContext'
import { ThemeProvider } from './context/ThemeContext'
import { ServerImageProvider } from './context/ServerImageContext'
import ConfiguratorPage from './pages/ConfiguratorPage'
import AdminPage from './pages/AdminPage.tsx'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'

function App() {
  return (
    <ThemeProvider>
      <PriceProvider>
        <ServerImageProvider>
          <ConfiguratorProvider>
            <div className="min-h-screen flex flex-col bg-themed">
              <Header />
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:py-8 animate-fade-up">
                <Routes>
                  <Route path="/" element={<ConfiguratorPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ConfiguratorProvider>
        </ServerImageProvider>
      </PriceProvider>
    </ThemeProvider>
  )
}

export default App
