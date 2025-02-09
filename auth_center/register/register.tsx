import React from 'react';
import { FormikValues, useFormik } from 'formik';
import { registerUserSchema } from '../../../validations';
import { Button } from '../../../ui-components/button';

function LoginForm() {
  const onSubmit = async (values: FormikValues, actions: FormikValues) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    actions.resetForm();
  };
  type IValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
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
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    } as IValues,
    validationSchema: registerUserSchema,
    onSubmit,
  });

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={' flex md:w-[400px] gap-y-6  flex-col p-10 '}
      >
        <div className={'flex  flex-col gap-5'}>
          <div className={'flex flex-col relative items-start'}>
            <span>Name</span>
            <label className={'text-[12px] w-[100%]'} htmlFor="name">
              <input
                className={`border focus:outline-none h-[36px] flex w-[100%] p-1 ${errors.name && touched.name ? 'border-2 border-kpmg-alert-light_red' : `${touched.name ? 'border-[2px] border-kpmg-alert-light_green' : ''}`}`}
                type="text"
                id="name"
                name="name"
                placeholder="Please enter your name"
                onChange={handleChange}
                value={values.name}
                onBlur={handleBlur}
              />
            </label>
            <span className={'text-kpmg-alert-red text-[0.7rem]'}>
              {errors.name}
            </span>
          </div>
        </div>
        <div className={'flex  flex-col gap-5'}>
          <div className={'flex flex-col relative items-start'}>
            <span>Email</span>
            <label className={'text-[12px] w-[100%]'} htmlFor="name">
              <input
                className={`border focus:outline-none h-[36px] flex w-[100%] p-1 ${errors.email && touched.email ? 'border-2 border-kpmg-alert-light_red' : `${touched.email ? 'border-[2px] border-kpmg-alert-light_green' : ''}`}`}
                type="text"
                id="email"
                name="email"
                placeholder="Please enter your email"
                onChange={handleChange}
                value={values.email}
                onBlur={handleBlur}
              />
            </label>
            <span className={' text-kpmg-alert-red text-[0.7rem]'}>
              {errors?.email}
            </span>
          </div>
        </div>
        <div className={'flex  flex-col gap-5'}>
          <div className={'flex flex-col relative items-start'}>
            <span>Password</span>
            <label className={'text-[12px] w-[100%]'} htmlFor="Password">
              <input
                className={`border focus:outline-none h-[36px] flex w-[100%] p-1 ${errors.password && touched.password ? 'border-2 border-kpmg-alert-light_red' : `${touched.password ? ' border-kpmg-alert-light_green' : ''}`}`}
                type="text"
                id="Password"
                name="password"
                placeholder="Please enter your Password"
                onChange={handleChange}
                value={values.password}
                onBlur={handleBlur}
              />
            </label>
            <span className={'text-kpmg-alert-red text-[0.7rem]'}>
              {errors?.password}
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
                placeholder="Enter same password"
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
        <Button
          className={`bg-kpmg-primary-combat_blue h-[40px] text-kpmg-primary-white items-center ${isSubmitting ? 'cursor-wait' : ''} ${isSubmitting ? 'opacity-[0.5]' : ''}`}
          props={{ type: 'submit', disabled: isSubmitting }}
          value={'Sign In'}
        />
      </form>
    </>
  );
}

export default LoginForm;
