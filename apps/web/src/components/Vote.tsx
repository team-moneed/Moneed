// import Card from "./Card";
// import { useParams } from 'react-router-dom';
// import { useState } from "react";

// const Vote = () => {
//     const { stocktype } = useParams();

//     //카테고리에 해당하는 투표 결과 가져오는 api
//     // const [votes, setVotes] = useState({
//     //     raise: 0,
//     //     lower: 0
//     // });

//     const [isVoted, setIsVoted] = useState(false);

//     const handleRaise = () => {
//         console.log('오른다')
//         setIsVoted(true)
//     }

//     const handleLower = () => {
//         console.log('내린다')
//     }

//     return (
//         <>
//             <div>
//                 {stocktype}
//             </div>
//             <Card
//                 onClick={handleRaise}
//                 title="오른다"
//                 cardImgages={"png"}
//             >

//             </Card>
//             <Card
//                 onClick={handleLower}
//                 title="내린다"
//                 cardImgages={"png"}>
//             </Card>
//             {isVoted && <div>투표완</div>}
//         </>
//     );
// };

// export default Vote;
