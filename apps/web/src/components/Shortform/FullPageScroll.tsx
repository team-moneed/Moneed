// import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";

// type PFullPageScroll = {
//   onPageChange?: (page: number) => void;
//   onLoad?: (limit: number) => void;
// } & PropsWithChildren;

// export const FullPageScroll: React.FC<PFullPageScroll> = ({
//   children,
//   onLoad = () => { },
//   onPageChange = () => { },
// }) => {
//   const outerDivRef = useRef<HTMLDivElement>(null);
//   const currentPage = useRef<number>(0);
//   const canScroll = useRef<boolean>(true);
//   const oldTouchY = useRef<number>(0);
//   const [_, refresh] = useState<number>(0);

//   const scrollDown = useCallback(() => {
//     console.log(`scrollDown`)
//     const pageHeight = outerDivRef.current?.children.item(0)?.clientHeight; // 화면 세로 길이 100vh
//     if (outerDivRef.current && pageHeight) {
//       outerDivRef.current.scrollTo({
//         top: pageHeight * (currentPage.current + 1),
//         left: 0,
//         behavior: "smooth",
//       });
//       canScroll.current = false;
//       setTimeout(() => {
//         canScroll.current = true;
//       }, 500);
//       if (outerDivRef.current.childElementCount - 1 > currentPage.current)
//         currentPage.current++;
//     }
//     console.log(currentPage.current);
//     onPageChange(currentPage.current);
//     refresh((v) => v + 1);
//   }, [onPageChange]);

//   const scrollUp = useCallback(() => {
//     console.log(`scrollUp`)
//     const pageHeight = outerDivRef.current?.children.item(0)?.clientHeight; // 화면 세로 길이 100vh
//     if (outerDivRef.current && pageHeight) {
//       outerDivRef.current.scrollTo({
//         top: pageHeight * (currentPage.current - 1),
//         left: 0,
//         behavior: "smooth",
//       });
//       canScroll.current = false;
//       setTimeout(() => {
//         canScroll.current = true;
//       }, 500);
//       if (currentPage.current > 0) currentPage.current--;
//     }
//     console.log(currentPage.current);
//     onPageChange(currentPage.current);
//     refresh((v) => v + 1);
//   }, [onPageChange]);

//   const wheelHandler = useCallback((e: WheelEvent) => {
//     console.log("wheelHandler")
//     e.preventDefault();
//     if (!canScroll.current) return;
//     const { deltaY } = e; // +is down -is up
//     console.log("scroll to", outerDivRef.current?.scrollHeight);
//     if (deltaY > 0 && outerDivRef.current) {
//       scrollDown();
//     } else if (deltaY < 0 && outerDivRef.current) {
//       scrollUp();
//     }
//   }, [scrollDown, scrollUp]); // wheel Handler

//   const scrollHandler = useCallback((e: Event) => {
//     console.log(`scrollHandler`)
//     e.preventDefault();
//   }, []);

//   const onTouchDown = useCallback((e: TouchEvent) => {
//     console.log(`onTouchDown`)
//     oldTouchY.current = e.changedTouches.item(0)?.clientY || 0;
//   }, []);

//   const onTouchUp = useCallback((e: TouchEvent) => {
//     console.log(`onTouchUp`)
//     const currentTouchY = e.changedTouches.item(0)?.clientY || 0;
//     const isScrollDown: boolean =
//       oldTouchY.current - currentTouchY > 0 ? true : false;

//     if (isScrollDown) {
//       scrollDown();
//     } else {
//       scrollUp();
//     }
//   }, [scrollDown, scrollUp]);

//   useEffect(() => {
//     const outer = outerDivRef.current;
//     if (!outer) return;
//     console.log(`outer`, outer)
//     onLoad(outerDivRef.current.childElementCount);
//     // refresh((v) => v + 1);
//     window.addEventListener("wheel", wheelHandler);
//     window.addEventListener("scroll", scrollHandler);
//     window.addEventListener("touchmove", scrollHandler);
//     window.addEventListener("touchstart", onTouchDown);
//     window.addEventListener("touchend", onTouchUp);
//     return () => {
//       window.removeEventListener("wheel", wheelHandler);
//       window.removeEventListener("scroll", scrollHandler);
//       window.removeEventListener("touchmove", scrollHandler);
//       window.removeEventListener("touchstart", onTouchDown);
//       window.removeEventListener("touchend", onTouchUp);
//     };
//   }, [wheelHandler, scrollHandler, onTouchDown, onTouchUp, onLoad]);

//   return (
//     <>
//       <div
//         ref={outerDivRef}
//         style={{ height: "100vh", width: "100%", overflowY: "hidden" }}
//       >
//         {children}
//       </div>
//       {/* <Dots
// 				limit={outerDivRef.current?.childElementCount || 0}
// 				currentIndex={currentPage.current}
// 				onDotClick={movePageTo}
// 			/> */}
//     </>
//   );
// };
