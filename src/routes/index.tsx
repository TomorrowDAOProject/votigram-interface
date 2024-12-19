import Loading from '@/components/Loading';
import React, { Suspense, LazyExoticComponent } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home: LazyExoticComponent<React.FC> = React.lazy(() => import('@/pageComponents/Home'));
const CreatePoll: LazyExoticComponent<React.FC> = React.lazy(() => import('@/pageComponents/CreatePoll'));

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<Loading className="h-screen w-screen" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-poll" element={<CreatePoll />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;