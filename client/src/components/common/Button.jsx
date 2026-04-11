export default function Button({ text, loading, ...props }) {
  return (
    <button disabled={loading} {...props}>
      {loading ? "Please wait..." : text}
    </button>
  );
}