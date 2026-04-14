import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { IndicesPage } from '@/features/indices/IndicesPage';
import { Top50Page } from '@/features/top50/Top50Page';
import { DetailPage } from '@/features/detail/DetailPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="indices" element={<IndicesPage />} />
        <Route path="top50" element={<Top50Page />} />
        <Route path="symbol/:symbol" element={<DetailPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
