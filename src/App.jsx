import { useContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import HootList from './components/HootList/HootList';
import HootDetails from './components/HootDetails/HootDetails';
import HootForm from './components/HootForm/HootForm';


import { UserContext } from './contexts/UserContext';

import * as hootService from './services/hootService';

const App = () => {
  const { user } = useContext(UserContext);
  const [hoots, setHoots] = useState([]);
  const navigate = useNavigate();


const handleAddHoot = async (hootFormData) => {
  const newHoot = await hootService.create(hootFormData);
  setHoots([newHoot, ...hoots]);
  navigate('/hoots');
};



  useEffect(() => {
    const fetchAllHoots = async () => {
      const hootsData = await hootService.index();

      // console.log('hootsData: ', hootsData);
      setHoots(hootsData); // setting hoots state
    };

    if (user) fetchAllHoots();
    // ^ only fetch hoots when a user is logged in
  }, [user]); // adding user dependency
  // because the effect depends on the user to run

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing />} />
        // src/App.jsx

        {user ? (
          <>
            {/* Protected Routes (available only to signed-in users) */}
            <Route path='/hoots' element={<HootList hoots={hoots} />} />
            // src/App.jsx

            <Route
              path='/hoots/new'
              element={<HootForm handleAddHoot={handleAddHoot} />}
            />

            <Route
              path='/hoots/:hootId'
              element={<HootDetails />}
            />
          </>
        ) : (
          <>
            {/* Non-user Routes (available only to guests) */}
            <Route path='/sign-up' element={<SignUpForm />} />
            <Route path='/sign-in' element={<SignInForm />} />
          </>
        )}

        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
      </Routes>
    </>
  );
};

export default App;
