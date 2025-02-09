import React, {
  useState,
  useRef,
  FormEvent,
  ChangeEvent,
  KeyboardEvent,
  FC,
  useEffect,
} from 'react';
import { Button } from '../../../ui-components/button';
import {
  useGetAccessMutation,
  useRequestLoginOtpMutation,
  useValidateOtpMutation,
} from '../authApi';
import { RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import AppLoading from '../../../ui-components/appLoading';
import { closeModal } from '../../modal/modalSlice';
import { allIcons } from '../../../assets/icons';

const OtpPopup: FC = () => {
  const [
    validateToken,
    { data: validateResponse, isLoading, isError, isSuccess, error },
  ] = useValidateOtpMutation();

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
  // const [
  //   getAccess,
  //   {
  //     data: accessToken,
  //     isLoading: accessLoading,
  //     isError: accessErrorIsError,
  //     isSuccess: accessSuccess,
  //     error: accessError,
  //   },
  // ] = useGetAccessMutation();

  const [errorData, setError] = useState(error);
  const [message, setMessage] = useState('');
  const { userName } = useSelector((state: RootState) => state.persistUser);
  const [otp, setOtp] = useState<string[]>(Array(8).fill(''));
  const [timerState, setTimerState] = useState(60);
  const [waitTime, setWaitTime] = useState(60); // Initial wait time set to 60 seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 3000);
      setError(error?.data);
    }
  }, [error]);

  useEffect(() => {
    if (newOtpError) {
      setTimeout(() => {
        setError(null);
      }, 3000);
      setError(newOtpError?.data);
    }
  }, [newOtpError]);

  useEffect(() => {
    if (newOtpData) {
      setMessage(newOtpData?.message);
      setTimeout(() => {
        setMessage('');
      }, 8000);
    }
  }, [newOtpData]);

  useEffect(() => {
    if (timerState > 0) {
      const interval = setInterval(() => {
        setTimerState((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerState]);

  const resetTimer = () => {
    if (timerState > 0) return;
    requestLoginOtp({ userName });
    const newWaitTime = waitTime + 30;
    setWaitTime(newWaitTime); // Increase wait time by 30 seconds
    setTimerState(newWaitTime); // Reset timer state to the new wait time
  };

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== '' && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (element: HTMLInputElement, index: number) => {
    if (element.value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    validateToken({ token: otp.join(''), userName });
  };

  return (
    <div className="w-[400px] flex flex-col  rounded-lg    relative bg-white">
      <div className=" bg-[#1E49E2] rounded-t-md  self-center mr-auto ml-auto w-[100%] text-white flex flex-row items-center justify-center h-[37px] align-middle ">
        <div
          onClick={(e) => dispatch(closeModal())}
          className="flex  font-semibold absolute right-5   z-20 w-[20px] h-[20px] cursor-pointer  flex-row items-center justify-center rounded-full bg-gray-200 hover:bg-gray-400 "
        >
          {allIcons.close({ width: '9px' })}
        </div>
        <span className="text-center text-[15px] font-[600] font-sans  ">
          {'Enter OTP'}
        </span>
      </div>
      <div className=" py-[10px] self-center  max-w-md w-full my-[10px] px-[20px]">
        {newTokenLoading || isLoading ? <AppLoading /> : null}
        <form
          onSubmit={handleSubmit}
          className="flex  justify-center align-middle items-center flex-col"
        >
          <div className="flex space-x-2 justify-center mb-6">
            {otp.map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-[35px] h-[35px] border rounded text-center text-[12px] text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 outline-1 outline-blue-400 border-blue-400"
                value={otp[index]}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(e.target, index)
                }
                onKeyUp={(e: KeyboardEvent<HTMLInputElement>) =>
                  e.key === 'Backspace'
                    ? handleBackspace(e.currentTarget, index)
                    : null
                }
                ref={(ref) => (inputRefs.current[index] = ref)}
              />
            ))}
          </div>

          <Button
            className={`bg-kpmg-primary-combat_blue text-[12px] h-[35px] w-[60%] justify-center text-kpmg-primary-white items-center ${isLoading ? 'cursor-wait' : ''} ${isLoading ? 'opacity-[0.5]' : ''} self-center mr-auto ml-auto`}
            props={{ type: 'submit', disabled: isLoading || newTokenLoading }}
            value={'Verify OTP'}
          />

          <div className="mt-[10px] flex w-[372px]  text-center text-[12px]   justify-center  self-center mr-auto ml-auto text-blue-700">
            <span
              onClick={!timerState ? resetTimer : () => void 0}
              className={`${timerState ? ' cursor-not-allowed' : 'text-white cursor-pointer px-[10px] bg-blue-600 rounded-md'} text-[12px]  items-center justify-center  py-[5px] self-center flex`}
            >
              {`Request new OTP`}
            </span>
            <span className="py-[5px] ml-[2px] self-center flex text-green-600">{` ${timerState ? `  in ${timerState} seconds ` : ''} `}</span>
          </div>

          <span
            className={` mr-auto ml-auto justify-center align-middle items-center bg-stone-100  py-[5px] w-[100%]  text-[12px] self-center  my-[12px] flex $ ${errorData ? 'text-red-500' : 'text-slate-600'}`}
          >{` ${errorData ? errorData?.message : message} `}</span>
        </form>
      </div>
    </div>
  );
};

export default OtpPopup;
