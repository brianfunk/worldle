interface Props {
  message: string | null;
}

export default function Toast({ message }: Props) {
  return (
    <div className={`toast ${message ? 'show' : ''}`} role="status">
      {message}
    </div>
  );
}
