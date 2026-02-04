const ProtectedRoute = ({ allowedRoles, children }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [authFailed, setAuthFailed] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        await dispatch(userInfo()).unwrap();
      } catch {
        // ❌ DO NOT navigate here
        setAuthFailed(true);
      } finally {
        setLoading(false);
      }
    }

    if (!userData) fetchUser();
    else setLoading(false);
  }, []);

  // ⏳ Wait until auth check finishes
  if (loading) return <Loader />;

  // ❌ Auth failed → redirect
  if (authFailed || !userData) {
    return <Navigate to="/" replace />;
  }

  // 🔐 Role protection
  if (allowedRoles && !allowedRoles.includes(userData.Account)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
