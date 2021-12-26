import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { lazy, Suspense } from 'react'
import './App.scss';
import Header from './components/Header';

const RouteList = () => {
  const TitleInput = lazy(() => import('./components/InputScreen'))
  const SellerNetSheetInput = lazy(() => import('./components/SellerNetSheetInput'))
  return (
    <Routes>
      <Route path="/quickquote" element={<TitleInput />} exact />
      <Route path="/sellernetsheetinput" element={<SellerNetSheetInput />} exact />
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
