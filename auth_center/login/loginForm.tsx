import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import eyeIcon from '../../../assets/icons/eyeIcon.svg';
import { userLoginSchema } from '../../../validations';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../ui-components/button';
import { loginCredentials } from '../../../types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useLoginMutation } from '../authApi';

const LoginForm = () => {
  const { isAuthenticated, currentRole } = useSelector(
    (state: RootState) => state.persistUser,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      if (currentRole == 'SuperAdmin' || currentRole == 'Administrator') {
        navigate('/profile/admin/analytics');
      } else {
        navigate('/profile/client/overview');
      }
    }
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [
    login,
    { data: response, isError, endpointName, isLoading, isSuccess },
  ] = useLoginMutation('loginApi' as any);

  const onSubmit = async (values: loginCredentials) => {
    const credentials: loginCredentials = {
      username: values.username,
      password: values.password,
    };

    try {
      const { data } = await login({ ...credentials }).unwrap();
    } catch (error: any) {}
  };
  const { values, handleBlur, touched, handleChange, handleSubmit, errors } =
    useFormik({
      initialValues: {
        username: '',
        password: '',
      },
      validationSchema: userLoginSchema,
      onSubmit,
    });

  return (
    <>
      <div
        className={
          'flex  relative  mr-auto ml-auto items-center flex-col  content-center w-[100%] h-[100%]   justify-center mt-auto mb-auto p-5  '
        }
      >
        <form
          onSubmit={handleSubmit}
          className={
            ' flex sm:w-[100%] mdl:py-20  mdl:w-[30rem] gap-y-7  flex-col  overflow-y-auto  '
          }
        >
          <span
            className={
              'font-[700] font-["Open Sans"] leading-normal  sm:text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] tracking-normal'
            }
          >
            {'Sign In'}
          </span>
          <div className={'flex  flex-col gap-4 w-[100%] '}>
            <div className={'flex flex-col relative items-start w-[100%]'}>
              <span>Email</span>
              <label className={'text-[12px] w-[100%]'} htmlFor="username">
                <input
                  className={`border sm:w-[100%] focus:outline-none h-[48px] relative flex  px-1 ${errors.username && touched.username ? 'border-2 border-kpmg-alert-light_red' : `${touched.username ? 'border-[2px] border-kpmg-alert-light_green' : ''}`}`}
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your company’s email address"
                  onChange={handleChange}
                  value={values.username}
                  onBlur={handleBlur}
                />
              </label>
              <span className={' text-kpmg-alert-red text-[0.7rem]'}>
                {errors?.username}
              </span>
            </div>
          </div>

          <div className={'flex  flex-col gap-4 w-[100%] '}>
            <div className={'flex flex-col relative items-start w-[100%]'}>
              <span>Password</span>
              <label
                className={'text-[12px] w-[100%] flex-row relative'}
                htmlFor="Password"
              >
                <input
                  className={`border focus:outline-none h-[48px] sm:w-[100%] flex  p-1 ${errors.password && touched.password ? 'border-2 border-kpmg-alert-light_red' : `${touched.password ? ' border-kpmg-alert-light_green' : ''}`}`}
                  type={showPassword ? 'text' : 'password'}
                  id="Password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={values.password}
                  onBlur={handleBlur}
                />
                <img
                  src={eyeIcon}
                  alt="hidePassword"
                  srcSet=""
                  className={'absolute right-[5px] cursor-pointer top-[12px]'}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </label>
              <span className={'text-kpmg-alert-red text-[0.7rem]'}>
                {errors?.password}
              </span>
            </div>
          </div>
          <div
            className={
              'flex flex-row align-middle justify-start items-center font-[Open Sans]'
            }
          >
            <span className={'tracking-[0.26px] leading-[26px] font-[400]'}>
              <input
                type="checkbox"
                style={{
                  outlineWidth: '0px',
                  border: 'none',
                  outline: 'none',
                  marginRight: '13px',
                }}
              />{' '}
              Keep me signed in
            </span>
          </div>

          <Button
            className={`bg-kpmg-primary-combat_blue min-h-[45px] max-h-[45px] sm:w-[100%]  justify-center text-kpmg-primary-white items-center ${isLoading ? 'cursor-wait' : ''} ${isLoading ? 'opacity-[0.5]' : ''}`}
            props={{ type: 'submit', disabled: isLoading }}
            value={'Sign In'}
          />

          <div>
            <Link
              to={'/auth/forgot-password'}
              className={
                'text-[#000] hover:text-[#1E49E2] font-[600] tracking-[0.28px] leading-[26px]'
              }
            >
              {'Forgot Password?'}
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm as any;
