import AppLayout from "./components/layout/AppLayout";

export default function App() {
  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome to EthixPortal
      </h1>
      <p className="mt-2 text-gray-600">
        Your gateway to IEC Management
      </p>
    </AppLayout>
  );
}