import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import {
  changePasswordSchema,
  changePasswordSchemaLoggedIn,
} from '../../../validations';
import { IchangePassword } from '../../../types';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, openModal } from '../../modal/modalSlice';
import { Button } from '../../../ui-components/button';
import { useChangePasswordMutation } from '../authApi';
import { RootState } from '../../../redux/store';
import { updateTermsAndConditions } from '../authSlice';
import { Link } from 'react-router-dom';
import AcceptTerms from '../acceptTerms/acceptTerms';
import { extractEmailAddress, JWTDecode } from '../../../utils';

function ChangePasswordForm({ location = 'auth' }: any) {
  const { userName, isAcceptTermsRequired, accessToken } = useSelector(
    (state: RootState) => state.persistUser,
  );
  const [emailReset, setEmailReset] = useState(userName);
  const dispatch = useDispatch();
  const [changePassword, { data: response, error, endpointName, isLoading }] =
    useChangePasswordMutation('userLogin' as any);

  useEffect(() => {
    const token = JWTDecode({ token: accessToken as string });
    const email = extractEmailAddress(token);
    setEmailReset(email);
  }, [accessToken]);
  const onSubmit = async (values: IchangePassword) => {
    const credentials: IchangePassword = {
      username: userName || emailReset,
      newPassword: values.newPassword,
      token: values.token,
      isAcceptTermsRequired,
    };

    try {
      await changePassword({
        ...credentials,
      }).unwrap();
    } catch (error: any) {}
  };

  type IValues = {
    confirmPassword: string;
    username: string;
    newPassword: string;
    token: string;
    isAcceptTermsRequired: boolean;
  };
  const {
    values,
    handleBlur,
    touched,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      token: '',
      confirmPassword: '',
      username: userName,
      isAcceptTermsRequired,
    } as IValues,
    validationSchema:
      location == 'auth' ? changePasswordSchema : changePasswordSchemaLoggedIn,
    onSubmit,
  });

  const handlePolicy = () => {
    dispatch(
      openModal({
        element: (
          <AcceptTerms
            handleChange={handleChange}
            handleClose={() => dispatch(closeModal())}
          />
        ),
      }),
    );
  };

  const handleAcceptTerms = () => {
    dispatch(
      updateTermsAndConditions({
        isAcceptTermsRequired: !isAcceptTermsRequired,
      }),
    );
  };
  return (
    <>
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
          {'Change Password'}
        </span>

        <div className={'flex  flex-col gap-y-5'}>
          <div className={'flex  flex-col gap-5'}>
            <div className={'flex flex-col relative items-start'}>
              <span>{'Enter OTP'}</span>
              <label className={'text-[12px] w-[100%]'} htmlFor="token">
                <input
                  className={`border focus:outline-none h-[36px] flex w-[100%] p-1 ${errors.token && touched.token ? 'border-2 border-kpmg-alert-light_red' : `${touched.token ? ' border-kpmg-alert-light_green' : ''}`}`}
                  type="text"
                  id="token"
                  name="token"
                  placeholder="Please Enter OTP Sent To Your Email"
                  onChange={handleChange}
                  value={values.token}
                  onBlur={handleBlur}
                />
              </label>
              <span className={'text-kpmg-alert-red text-[0.7rem]'}>
                {errors?.token}
              </span>
            </div>
          </div>
          <div className={'flex  flex-col gap-5'}>
            <div className={'flex flex-col relative items-start'}>
              <span>New Password</span>
              <label className={'text-[12px] w-[100%]'} htmlFor="newPassword">
                <input
                  className={`border focus:outline-none h-[36px] flex w-[100%] p-1 ${errors.newPassword && touched.newPassword ? 'border-2 border-kpmg-alert-light_red' : `${touched.newPassword ? ' border-kpmg-alert-light_green' : ''}`}`}
                  type="text"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter A New Password"
                  onChange={handleChange}
                  value={values.newPassword}
                  onBlur={handleBlur}
                />
              </label>
              <span className={'text-kpmg-alert-red text-[0.7rem]'}>
                {errors?.newPassword}
              </span>
            </div>
          </div>

          <div className={'flex  flex-col gap-5'}>
            <div className={'flex flex-col relative items-start'}>
              <span>Confirm Password</span>
              <label className={'text-[12px] w-[100%]'} htmlFor="confirm">
                <input
                  className={`border focus:outline-none h-[36px] flex w-[100%] p-1 ${errors.confirmPassword && touched.confirmPassword ? 'border-2border-kpmg-alert-light_red' : `${touched.confirmPassword ? 'border-[2px] border-kpmg-alert-light_green' : ''}`}`}
                  type="text"
                  id="confirm"
                  name="confirmPassword"
                  placeholder="Re-Enter Your Password"
                  onChange={handleChange}
                  value={values.confirmPassword}
                  onBlur={handleBlur}
                />
              </label>
              <span className={'text-kpmg-alert-red text-[0.7rem]'}>
                {errors?.confirmPassword}
              </span>
            </div>
          </div>
          {location === 'auth' && (
            <div className={'flex  flex-col gap-5   '}>
              <div className={'flex flex-col w-[100%]  relative items-start '}>
                <pre className="flex text-nowrap justify-start  font-sans w-[100%] text-[12px]  ">
                  <span>{'By clicking the checkbox, you agree to our'}</span>
                  <Link
                    to={`https://kpmg.com/ng/en/home/misc/privacy.html`}
                    target="_blank"
                    className="flex cursor-pointer text-blue-700 mx-[3px] font-bold"
                  >
                    {'Privacy Policy'}
                  </Link>
                  {'and'}
                  <span
                    onClick={() => handlePolicy()}
                    className="flex space-x-2 cursor-pointer text-blue-700 font-bold ml-[3px]"
                  >
                    {'Terms'}
                  </span>
                </pre>
                <label
                  className={' w-[100%]  flex flex-row '}
                  htmlFor="isAcceptTermsRequired"
                >
                  <input
                    className={`border focus:outline-none mt-[10px] h-[15px] font-700 flex w-[15px]  p-1 ${errors.confirmPassword && touched.confirmPassword ? 'border-2border-kpmg-alert-light_red' : `${touched.confirmPassword ? 'border-[2px] border-kpmg-alert-light_green' : ''}`}`}
                    type="checkbox"
                    name="isAcceptTermsRequired"
                    onChange={(e) => {
                      handleChange(e);
                      handleAcceptTerms();
                    }}
                    checked={isAcceptTermsRequired}
                    onBlur={handleBlur}
                  />
                  <span
                    className={
                      'text-kpmg-alert-red text-[0.7rem] mt-[10px] ml-[20px]'
                    }
                  >
                    {errors?.isAcceptTermsRequired}
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className={'flex flex-col items-center gap-y-4'}>
          <Button
            className={`bg-kpmg-primary-combat_blue h-[40px] w-[372px] justify-center text-kpmg-primary-white items-center ${isLoading ? 'cursor-wait' : ''} ${isLoading ? 'opacity-[0.5]' : ''}`}
            props={{ type: 'submit', disabled: isLoading }}
            value={'Save'}
          />
        </div>
      </form>
    </>
  );
}

export default ChangePasswordForm;
