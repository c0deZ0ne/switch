import React, { FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { closeModal } from '../../modal/modalSlice';
import { RootState } from '../../../redux/store';
import { updateTermsAndConditions } from '../authSlice';
import { allIcons } from '../../../assets/icons';
import PrivacyPolicy from './policy';

const AcceptTerms = ({
  handleChange,
  handleClose,
}: {
  handleChange: (e: any) => void;
  handleClose: () => void;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userName, isAcceptTermsRequired } = useSelector(
    (state: RootState) => state.persistUser,
  );
  const [acceptedTerms, setAcceptedTerms] = useState(isAcceptTermsRequired);

  useEffect(() => {
    setAcceptedTerms(isAcceptTermsRequired);
  }, [isAcceptTermsRequired]);

  const handleAcceptTerms = () => {
    dispatch(
      updateTermsAndConditions({
        isAcceptTermsRequired: !isAcceptTermsRequired,
      }),
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: '-100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: '-100%' }}
        className="flex justify-center items-center h-screen align-middle w-full rounded-lg"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="w-[700px] h-[600px]  bg-white rounded-lg relative flex flex-col items-center gap-[10px] align-middle justify-center"
        >
          <div className=" bg-[#1E49E2] rounded-t-md w-[100%] text-white flex flex-row items-center justify-center h-[45px] align-middle ">
            <div
              onClick={(e) => handleClose()}
              className="flex  font-semibold absolute right-5   z-20 w-[20px] h-[20px] cursor-pointer  flex-row items-center justify-center rounded-full bg-gray-200 hover:bg-gray-400 "
            >
              {allIcons.close({ width: '9px' })}
            </div>
            <span className="text-center text-[15px] font-[600] font-sans  ">
              {'Accept Terms and Conditions'}
            </span>
          </div>
          <PrivacyPolicy />

          <div
            className={
              'flex flex-row w-[100%]  px-[20px]  gap-x-[20px]   relative   justify-center justify-items-center  align-middle items-center h-[40px] '
            }
          >
            <input
              type="checkbox"
              name="isAcceptTermsRequired"
              checked={acceptedTerms}
              className="w-[15px] h-[15px]"
              onChange={(e) => {
                handleAcceptTerms();
                handleChange(e);
              }}
            />
            <pre className="flex text-nowrap justify-start  font-sans w-[100%] text-[13px]  ">
              <span>{'By clicking the checkbox, you agree to our'}</span>
              <Link
                to={`https://kpmg.com/ng/en/home/misc/privacy.html`}
                className="flex cursor-pointer text-blue-700 mx-[3px] font-bold"
              >
                {'Terms'}
              </Link>
              {'and'}
              <span className="flex space-x-2 cursor-pointer text-blue-700 font-bold">
                {' Privacy Policy'}
              </span>
            </pre>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AcceptTerms;
