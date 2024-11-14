import { createHashRouter, RouterProvider } from "react-router-dom";

import SignUpPage from "./pages/sign_up_page";
import SignInPage from "./pages/sign_in_page";
import CandidatePage from "./pages/candidate_page";
import EmployerPage from "./pages/employer_page";
import NotFoundPage from "./pages/notfound_page";
import PrivateRoutes from "./common/private_Routes";
import Layout from "./Layout";

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/sign_in",
        element: <SignInPage />,
      },
      {
        element: <PrivateRoutes userGroup="AUTH" />,
        children: [
          {
            path: "/",
            element: <CandidatePage />,
            errorElement: <NotFoundPage />,
          },
          {
            path: "/employer",
            element: <EmployerPage />,
          },
        ],
      },
      {
        element: <PrivateRoutes userGroup="ADMIN" />,
        children: [
          {
            path: "/signup_page",
            element: <SignUpPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
