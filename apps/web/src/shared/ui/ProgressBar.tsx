type ProgressBarProps = {
    percentage: string;
    color: string;
};

const ProgressBar = ({ percentage, color = 'bg-blue-500' }: ProgressBarProps) => {
    return (
        <div className='w-full bg-gray-300 h-4 rounded-full overflow-hidden'>
            <div className={`${color} h-full`} style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

export default ProgressBar;
