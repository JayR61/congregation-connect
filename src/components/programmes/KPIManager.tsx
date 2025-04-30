
import { Programme } from '@/types';

export interface KPIManagerProps {
  programmes: Programme[];
  kpis: any[];
  onAddKPI: (kpi: any) => any;
  onUpdateKPI: (id: string, progress: number) => boolean;
}

const KPIManager = ({ programmes, kpis, onAddKPI, onUpdateKPI }: KPIManagerProps) => {
  return (
    <div>KPI Manager Component</div>
  );
};

export { KPIManager };
export default KPIManager;
