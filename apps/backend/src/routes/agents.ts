import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'busy' | 'offline';
  type: 'DevAgent' | 'DesignAgent' | 'DeployAgent' | 'DataAgent' | 'DocAgent';
}

let agents: Agent[] = [
  { id: uuidv4(), name: 'DevAgent-001', status: 'idle', type: 'DevAgent' },
  { id: uuidv4(), name: 'DesignAgent-001', status: 'busy', type: 'DesignAgent' },
  { id: uuidv4(), name: 'DeployAgent-001', status: 'offline', type: 'DeployAgent' },
];

router.get('/agents', (_req, res) => {
  res.json(agents);
});

export default router;
