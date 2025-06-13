import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from '@/store';
import { routeArray } from '@/config/routes';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="h-screen overflow-hidden bg-background">
        <Routes>
          {routeArray.map(route => (
            <Route 
              key={route.id} 
              path={route.path} 
              element={<route.component />} 
            />
          ))}
        </Routes>
        
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="dark"
          className="z-[9999]"
          toastClassName="bg-surface text-white border border-primary/20"
          progressClassName="bg-gradient-to-r from-primary to-secondary"
/>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;