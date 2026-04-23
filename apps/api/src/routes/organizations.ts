import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '@saas/database';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

const CreateOrgSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
});

router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const memberships = await prisma.orgMember.findMany({
      where: { userId: req.user!.userId },
      include: { organization: true },
    });
    return res.json({ organizations: memberships.map((m) => ({ ...m.organization, role: m.role })) });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const { name, slug } = CreateOrgSchema.parse(req.body);
    const org = await prisma.organization.create({
      data: {
        name,
        slug,
        members: { create: { userId: req.user!.userId, role: 'OWNER' } },
      },
      include: { members: true },
    });
    return res.status(201).json({ organization: org });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const membership = await prisma.orgMember.findFirst({
      where: { organizationId: req.params.id, userId: req.user!.userId },
    });
    if (!membership) return res.status(403).json({ error: 'Forbidden' });

    const org = await prisma.organization.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        members: {
          include: { user: { select: { id: true, email: true, name: true } } },
        },
      },
    });
    return res.json({ organization: org });
  } catch (err) {
    next(err);
  }
});

export default router;
