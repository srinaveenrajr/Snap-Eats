const NotFoundPage = () => {
  return (
    <div className="p-8 text-center">
      <h2 className="text-3xl font-bold">404 - Not Found</h2>
      <p className="text-slate-500 mt-2">
        The page you requested does not exist.
      </p>
      <a
        href="/"
        className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg"
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFoundPage;
