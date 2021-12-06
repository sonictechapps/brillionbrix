import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { lazy, Suspense } from 'react'
import './App.scss';
import Header from './components/Header';

const RouteList = () => {
  const Titlequoteform = lazy(() => import('./components/TitleQuoteForm'))
  return (
    <Routes>
      <Route path="/quickquote" element={<Titlequoteform />} exact />
    </Routes>
  )
}

React.memo(RouteList)

const App = () => {
  return (
    <Suspense fallback={<div>test</div>}>
      <Header />
      <BrowserRouter>
        <RouteList />
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
