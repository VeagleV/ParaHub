import { useState } from 'react';

export default function HookTest() {
    const [c, setC] = useState(0);
    return <button onClick={() => setC(c+1)}>cnt {c}</button>;
}
