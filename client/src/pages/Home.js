import React, { Fragment, useEffect, useState, Suspense, lazy } from 'react';
import { useQuery } from 'react-query';
import { API } from '../config';
import ErrorBoundary from '../components/ErrorBoundary';

const Navbar = lazy(() => import('../components/Navbar'));
const Banner = lazy(() => import('../components/Banner'));
const Films = lazy(() => import('../components/Films'));

const api = API();

const getFilmForBanner = async () => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.token,
    },
  };

  const response = await api.get('/banner', config);
  return response?.data;
};

const fetchFilm = async () => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await api.get('/films', config);
  return response?.data?.films;
};

export default function Home() {
  document.title = 'Online Cinema';

  const [buy, setBuy] = useState(false);
  const [load, setLoad] = useState(true);

  // banner
  const {
    data: banner,
    isSuccess: isSuccessGetBanner,
    remove,
  } = useQuery('bannerCache', getFilmForBanner, {
    refetchOnWindowFocus: false,
  });

  // films
  const { data, isSuccess } = useQuery('filmsCached', fetchFilm);

  useEffect(() => {
    if (isSuccessGetBanner && isSuccess) {
      setLoad(false);
    }
  }, [isSuccessGetBanner, isSuccess]);

  useEffect(() => {
    return () => remove();
  }, [remove]);

  return (
    <Fragment>
      <Navbar buy={buy} setBuy={setBuy} />
      <ErrorBoundary>
        <Suspense fallback={<></>}>
          {!load && (
            <Fragment>
              <Banner buy={buy} setBuy={setBuy} data={banner} />
              <Films title="List Film" data={data} />
            </Fragment>
          )}
        </Suspense>
      </ErrorBoundary>
    </Fragment>
  );
}
