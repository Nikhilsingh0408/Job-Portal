import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { setSingleJob } from '@/redux/jobSlice';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

function JobDiscription() {
    const {singleJob} = useSelector((store) => store.job);
    const {user} = useSelector((store) => store.auth);
    const isInitillyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitillyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async() => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            console.log(res);
            if(res.data.success) {
                setIsApplied(true); // update local stroge
                const updateSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]};
                dispatch(setSingleJob(updateSingleJob)); // help us to real time UI update 
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    // custom hook for getting single job
    useEffect(() => {
        const fetchSingleJob = async() => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {withCredentials:true})
                if(res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id])

    return (
        <div className='max-w-7xl mx-auto my-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        <Badge className={'text-blue-700 font-bold'} variant={'ghost'}>{singleJob?.position} Positions</Badge>
                        <Badge className={'text-[#F83002] font-bold'} variant={'ghost'}>{singleJob?.jobType}</Badge>
                        <Badge className={'text-[#6A38C2] font-bold'} variant={'ghost'}>{singleJob?.salary}LPA</Badge>
                    </div>
                </div>
                <Button onClick={isApplied ? null : applyJobHandler} disabled={isApplied} className={`rounded-xl ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#6A38C2] hover:bg-[#5f32ad]'}`} >{isApplied ? "Already Applied" : "Apply Now"}</Button>
            </div>
            <h1 className='border-b-2 border-gray-300 font-medium py-4'>Job Discription</h1>
            <div className='my-4'>
                <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                <h1 className='font-bold my-1'>Discription: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experienceLevel} yrs</span></h1>
                <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary} LPA</span></h1>
                <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt.split("T")[0]}</span></h1>
            </div>
        </div>
    )
}

export default JobDiscription