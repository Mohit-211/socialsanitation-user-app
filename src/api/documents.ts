// Documents the office has shared: sheets, scopes, estimates, quotes, service requests,
// contracts and invoices. Private PDF links expire after 2 hours, so they are never cached.
import { http } from './client';
import type {
  DocumentDetail,
  DocumentKind,
  DocumentRow,
  SigningLink,
} from './types';

export const getDocuments = async () =>
  (await http.get<{ items: DocumentRow[] }>('/client/documents')).items;

export const getDocument = (kind: DocumentKind, id: number) =>
  http.get<DocumentDetail>(`/client/documents/${kind}/${id}`);

/** Estimates, service requests and contracts only, while they await a signature. */
export const startSigning = (kind: DocumentKind, id: number) =>
  http.post<SigningLink>(`/client/documents/${kind}/${id}/sign`);
