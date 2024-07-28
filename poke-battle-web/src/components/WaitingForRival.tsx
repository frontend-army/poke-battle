export default function WaitingForRival() {
  return (
    <div className="flex flex-col items-center">
      <p className="text-lg font-semibold">Waiting for rival</p>
      <span className="loading loading-ring loading-lg text-accent" />
    </div>
  );
}
