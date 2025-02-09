import React from 'react';
import { useFormik } from 'formik';
import { forgotPasswordSchema } from '../../../validations';
import { Link } from 'react-router-dom';
import { IAuthenticatedUser, IPasswordRequestOtp } from '../../../types';
import { useDispatch } from 'react-redux';
import { Button } from '../../../ui-components/button';
import {
  useRequestLoginOtpMutation,
  useRequestPasswordOtpMutation,
} from '../authApi';
import { setUser } from '../authSlice';
import { AppSuccess } from '../../../ui-components/alert/alerts';
import Modal from '@mui/material/Modal';
import UserChangePasswordPopup from '../../client/users/userchangePassword';
function ForgotPasswordForm() {
  const [
    requestPasswordOtp,
    { data: response, error, endpointName, isLoading },
  ] = useRequestPasswordOtpMutation('resetOtp' as any);

  const [
    requestLoginOtp,
    {
      data: newOtpData,
      isLoading: newTokenLoading,
      isError: newTokenIsError,
      isSuccess: newOtpIsSuccess,
      error: newOtpError,
    },
  ] = useRequestLoginOtpMutation();

  const dispatch = useDispatch();
  const onSubmit = async (values: IPasswordRequestOtp) => {
    const credentials: IPasswordRequestOtp = {
      username: values.username,
    };

    try {
      dispatch(
        setUser({
          userName: credentials.username,
          email: credentials.username,
        } as IAuthenticatedUser),
      );
      handleOpenModal();
    } catch (error: any) {}
  };
  type IValues = {
    username: string;
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
      username: '',
    } as IValues,
    validationSchema: forgotPasswordSchema,
    onSubmit,
  });

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleClose = (e: any) => {
    e?.preventDefault();
    setIsOpen(false);
  };

  const handleOpenModal = () => {
    setIsOpen(() => true);
  };
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
          <div className={'flex flex-col space-y-5  '}>
            <span
              className={
                'font-[700] font-["Open Sans"] leading-normal  sm:text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] tracking-normal'
              }
            >
              {'Forgot Password'}
            </span>

            <span
              className={
                'font-[600] relative  w-[100%] font-["Open Sans"] leading-normal  text-[1rem] tracking-normal text-kpmg-gray-9 text-wrap'
              }
            >
              {
                'A code will be sent to the email provided. This code will be used to reset your account password.'
              }
            </span>
          </div>

          <div className={'flex  flex-col gap-4 w-[100%] '}>
            <div className={'flex  flex-col relative items-start w-[100%]'}>
              <span>Email</span>
              <label
                className={'text-[12px] w-[100%] flex-row relative'}
                htmlFor="email"
              >
                <input
                  className={`border sm:w-[100%] focus:outline-none h-[45px] relative flex  px-1 ${errors.username && touched.username ? 'border-2 border-kpmg-alert-light_red' : `${touched.username ? 'border-[2px] border-kpmg-alert-light_green' : ''}`}`}
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your company’s text-[1rem] email address font-[Open Sans]"
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
          <div className={'flex flex-col items-center gap-y-4'}>
            <Button
              className={`bg-kpmg-primary-combat_blue min-h-[45px] max-h-[45px] sm:w-[100%]  justify-center text-kpmg-primary-white items-center ${isLoading || errors?.username ? 'cursor-wait' : ''} ${isLoading || errors?.username ? 'opacity-[0.5]' : ''}`}
              props={{
                type: 'submit',
                disabled: isLoading || errors?.username,
              }}
              value={'Continue'}
            />

            <div
              aria-disabled={isLoading}
              className={`${isLoading ? 'disabled' : ''}`}
            >
              <Link
                to={'/auth/login'}
                className={`text-[#000] hover:text-[#1E49E2] font-[400]  self-center text-[1rem] tracking-[0.28px] leading-[26px] ${isLoading ? 'disabled' : ''}`}
              >
                {'I remember my password'}
              </Link>
            </div>
          </div>
        </form>

        <Modal
          open={isOpen}
          style={{ boxShadow: 'none', border: 'none' }}
          onClose={handleClose}
          className="custom-popover-second-level mr-auto ml-auto content-center justify-center items-center"
        >
          <div className="rounded-lg self-center  justify-center items-center align-middle mr-auto ml-auto  content-center place-content-center">
            <UserChangePasswordPopup
              handleCloseModal={handleClose}
              type={'beforeAuth'}
            />
          </div>
        </Modal>
      </div>
    </>
  );
}

export default ForgotPasswordForm;
