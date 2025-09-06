import { useEffect, useRef, useState } from "react";
import { initDraw } from "@/draw";
import { Circle, Pencil, RectangleHorizontal } from "lucide-react";
import { IconButton } from "./IconButton";

export type Tool = "circle" | "rect" | "pencil";


export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");
  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId, socket);
    }
  }, [canvasRef]);

  return (
    <div style={{ height: "100vh", overflow: "hidden"}}>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
      <TopBar selectedTool = {selectedTool} setSelectedTool={setSelectedTool}/> 
    </div>
  );
}

function TopBar ({selectedTool, setSelectedTool} : {
  selectedTool : Tool,
  setSelectedTool: (s:Tool)=> void
}) {
  return <div style={{position: "fixed", top: 10, left:10}}>
    <div className="flex gap-t">
      <IconButton onClick={()=>{
        setSelectedTool("pencil")
      }} activated={selectedTool == "pencil"} icon={<Pencil/>}/>
      <IconButton activated={selectedTool == "rect"} icon={<RectangleHorizontal/>} onClick={()=> {
        setSelectedTool("rect")
      }}/>
      <IconButton activated={selectedTool == "circle"} icon={<Circle/>} onClick={()=> {
        setSelectedTool("circle")
      }}/>
    </div>
    
</div>
}
