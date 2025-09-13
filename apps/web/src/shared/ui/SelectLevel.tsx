// import { LEEVLS } from "../../config/LevelSetting";
// import useLevelStore from "../../store/useLevelStore";
// import Button from "../Button";
// import Card from "../Card";

// const SelectLevel = () => {

//     const { selectedLevel, setSelectLevel } = useLevelStore();

//     const handlesubmitLevel = () => {
//         console.log('레벨제출', selectedLevel)
//     }

//     return (
//         <>
//             <div className="flex gap-4">
//                 {LEEVLS.map((level, index) => (
//                     <Card
//                         key={index}
//                         className={`cursor-pointer ${selectedLevel === level.level ? "border-blue-500" : "border-gray-300"
//                             }`}
//                         cardImgages={level.levelimg}
//                         title={level.level}
//                         onClick={() => setSelectLevel(level.level)}
//                     />
//                 ))}
//             </div>

//             <Button type="submit" className="green" theme="primary" onClick={handlesubmitLevel}>완료</Button>
//         </>
//     );
// };

// export default SelectLevel;
