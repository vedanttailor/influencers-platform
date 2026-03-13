import CreateManagerModal from "../components/managers/CreateManagerModal";
import ManagerTable from "../components/managers/ManagerTable";
import { ManagerProvider } from "../components/admin/manager/ManagerContext";

export default function ManagerPage() {
  return (
    <ManagerProvider>
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Managers</h2>
          <CreateManagerModal />
        </div>

        <ManagerTable />
      </div>
    </ManagerProvider>
  );
}
