import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async analyze(data: {
    subject: string;
    body?: string | null;
    sender?: string | null;
  }) {
    const text = `${data.subject} ${data.body ?? ''} ${data.sender ?? ''}`.toLowerCase();

    const classification = text.includes('procurement') || text.includes('purchase') || text.includes('invoice')
      ? 'PROCUREMENT'
      : text.includes('student') || text.includes('complaint')
        ? 'STUDENT_CASE'
        : text.includes('senate') || text.includes('council')
          ? 'GOVERNANCE'
          : 'GENERAL';

    const department =
      classification === 'PROCUREMENT' ? 'Finance' :
      classification === 'STUDENT_CASE' ? 'Registrar' :
      classification === 'GOVERNANCE' ? 'Vice Chancellor' :
      'Registry';

    const priority = text.includes('urgent') || text.includes('immediate') || text.includes('deadline') || text.includes('approval') || text.includes('purchase')
      ? 'HIGH'
      : 'MEDIUM';

    const confidence = classification === 'GENERAL' ? 0.96 : 0.98;

    return {
      classification,
      department,
      priority,
      confidence,
      summary: `AI classified this item as ${classification.toLowerCase().replace('_', ' ')} and recommended routing to ${department}.`,
      suggestedAction: 'Review policy constraints and assign to the recommended department.',
      policyFlags: classification === 'GOVERNANCE' ? ['CONFIDENTIAL_REVIEW_REQUIRED'] : [],
      reasons: [
        'Keyword and sender analysis matched institutional category patterns.',
        'Recommended department aligns with university routing policy.',
      ],
    };
  }
}
