import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';

// Main pages
import { HomeDashboard } from './pages/HomeDashboard';
import { Jobs } from './pages/Jobs';
import { CalendarPage } from './pages/CalendarPage';
import { WorldNews } from './pages/WorldNews';
import { Settings } from './pages/Settings';

// Semiconductor module
import { SemiconductorModule } from './pages/semiconductor/SemiconductorModule';
import { SemiDashboard } from './pages/semiconductor/SemiDashboard';
import { SemiCompanyList } from './pages/semiconductor/SemiCompanyList';
import { SemiCompanyDetail } from './pages/semiconductor/SemiCompanyDetail';
import { SemiTechDetail } from './pages/semiconductor/SemiTechDetail';
import { SemiMarketValue } from './pages/semiconductor/SemiMarketValue';
import { SemiValueChain } from './pages/semiconductor/SemiValueChain';
import { SemiTechnologyRoadmap } from './pages/semiconductor/SemiTechnologyRoadmap';
import { SemiProcessGuide } from './pages/semiconductor/SemiProcessGuide';

// Defense module
import { DefenseModule } from './pages/defense/DefenseModule';
import { DefenseDashboard } from './pages/defense/DefenseDashboard';
import { DefenseCompanyList } from './pages/defense/DefenseCompanyList';
import { DefenseCompanyDetail } from './pages/defense/DefenseCompanyDetail';
import { DefenseTechnologyList } from './pages/defense/DefenseTechnologyList';
import { DefenseTechnologyDetail } from './pages/defense/DefenseTechnologyDetail';
import { DefenseValueChain } from './pages/defense/DefenseValueChain';
import { DefenseRoadmap } from './pages/defense/DefenseRoadmap';
import { DefenseProcess } from './pages/defense/DefenseProcess';
import { DefenseMarketValue } from './pages/defense/DefenseMarketValue';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Home Dashboard */}
          <Route index element={<HomeDashboard />} />

          {/* Semiconductor Module */}
          <Route path="semiconductor" element={<SemiconductorModule />}>
            <Route index element={<SemiDashboard />} />
            <Route path="market-value" element={<SemiMarketValue />} />
            <Route path="value-chain" element={<SemiValueChain />} />
            <Route path="roadmap" element={<SemiTechnologyRoadmap />} />
            <Route path="process" element={<SemiProcessGuide />} />
            <Route path=":region" element={<SemiCompanyList />} />
            <Route path=":region/:segment" element={<SemiCompanyList />} />
            <Route path=":region/:segment/:companyId" element={<SemiCompanyDetail />} />
            <Route path="technology/:techId" element={<SemiTechDetail />} />
          </Route>
          {/* Legacy route redirection */}
          <Route path="semi-news" element={<Navigate to="/semiconductor" replace />} />

          {/* Defense Module */}
          <Route path="defense" element={<DefenseModule />}>
            <Route index element={<DefenseDashboard />} />
            <Route path="technologies" element={<DefenseTechnologyList />} />
            <Route path="value-chain" element={<DefenseValueChain />} />
            <Route path="roadmap" element={<DefenseRoadmap />} />
            <Route path="process" element={<DefenseProcess />} />
            <Route path="market-value" element={<DefenseMarketValue />} />
            <Route path="technology/:techId" element={<DefenseTechnologyDetail />} />
            <Route path=":region" element={<DefenseCompanyList />} />
            <Route path=":region/:segment" element={<DefenseCompanyList />} />
            <Route path=":region/:segment/:companyId" element={<DefenseCompanyDetail />} />
          </Route>

          {/* Other top-level modules */}
          <Route path="jobs" element={<Jobs />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="world-news" element={<WorldNews />} />
          <Route path="settings" element={<Settings />} />
          <Route path="workout/*" element={<Navigate to="/" replace />} />
          <Route path="study/*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
