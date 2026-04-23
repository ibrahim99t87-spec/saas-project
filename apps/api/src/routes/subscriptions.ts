import { Router } from 'express';
import { prisma } from '@saas/database';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/plans', async (_req, res, next) => {
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { priceMonthly: 'asc' },
    });
    return res.json({ plans });
  } catch (err) {
    next(err);
  }
});

router.get('/:orgId', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const membership = await prisma.orgMember.findFirst({
      where: { organizationId: req.params.orgId, userId: req.user!.userId },
    });
    if (!membership) return res.status(403).json({ error: 'Forbidden' });

    const subscription = await prisma.subscription.findFirst({
      where: { organizationId: req.params.orgId },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ subscription });
  } catch (err) {
    next(err);
  }
});

export default router;
