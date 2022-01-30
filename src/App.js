import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React, { lazy, Suspense } from 'react'
import './App.scss';
import Header from './components/Header';

const RouteList = () => {
  const TitleInput = lazy(() => import('./components/InputScreen'))
  const SellerNetSheetInput = lazy(() => import('./components/SellerNetSheetInput'))
  const BuyerNetSheetInput = lazy(() => import('./components/BuyerNetSheet'))

  const QuoteSummary = lazy(() => import('./components/QuoteSummary'))
  const SellerNetSheet = lazy(() => import('./components/SellerNetSheet'))
  console.log('kkk', process.env.REACT_APP_URL)

  return (
    <Routes>
      <Route path="/" element={<TitleInput />} exact />
      <Route path="/sellernetsheetinput" element={<SellerNetSheetInput />} exact />
      <Route path="/buyernetsheetinput" element={<BuyerNetSheetInput />} exact />
      <Route path="/quotesummary" element={<QuoteSummary />} exact />
      <Route path="/sellernetsheet" element={<SellerNetSheet />} exact />
    </Routes>
  )
}

React.memo(RouteList)

const App = () => {
  const baseName = process.env.REACT_APP_URL === undefined ? '/billionbrix': process.env.REACT_APP_URL
  console.log('billionbrix', process.env.REACT_APP_URL)
  return (
    <Suspense fallback={<div>test</div>}>
      <BrowserRouter basename={baseName}>
        <Header />
        <RouteList />
      </BrowserRouter>
    </Suspense>
  );
}

export default App
