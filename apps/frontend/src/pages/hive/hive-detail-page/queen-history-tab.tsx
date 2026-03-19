import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useHiveQueenHistory } from '@/api/hooks';

interface QueenHistoryTabProps {
  hiveId: string;
}

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ACTIVE: 'default',
  REPLACED: 'secondary',
  DEAD: 'destructive',
  UNKNOWN: 'outline',
};

const COLOR_CLASSES: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  indigo: 'bg-indigo-500',
  pink: 'bg-pink-500',
  gray: 'bg-gray-500',
  black: 'bg-black',
  white: 'bg-white border border-gray-200',
};

export const QueenHistoryTab: React.FC<QueenHistoryTabProps> = ({ hiveId }) => {
  const { data: queens, isLoading } = useHiveQueenHistory(hiveId);

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!queens || queens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Crown className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No queen history for this hive.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Queen</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Installed</TableHead>
            <TableHead>Replaced</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queens.map((queen) => {
            const colorClass = queen.color
              ? (COLOR_CLASSES[queen.color.toLowerCase()] ?? 'bg-gray-200')
              : 'bg-gray-200';
            return (
              <TableRow key={queen.id}>
                <TableCell>
                  <Link to={`/queens/${queen.id}`} className="font-medium hover:underline">
                    {queen.name || queen.marking || `Queen ${queen.year ?? '—'}`}
                  </Link>
                </TableCell>
                <TableCell>
                  {queen.color && (
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full border border-gray-400 ${colorClass}`} />
                      <span className="capitalize text-sm">{queen.color}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{queen.year ?? '—'}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[queen.status ?? 'UNKNOWN'] ?? 'outline'}>
                    {queen.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {queen.installedAt ? format(parseISO(queen.installedAt), 'PP') : '—'}
                </TableCell>
                <TableCell className="text-sm">
                  {queen.replacedAt ? format(parseISO(queen.replacedAt), 'PP') : '—'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
