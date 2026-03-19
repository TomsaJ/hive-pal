import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Crown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQueens, useHives } from '@/api/hooks';

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

export const QueenListPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [hiveFilter, setHiveFilter] = useState<string>('all');

  const { data: hives } = useHives();
  const { data: queens, isLoading } = useQueens({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    hiveId: hiveFilter !== 'all' ? hiveFilter : undefined,
  });

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Crown className="h-6 w-6 text-amber-500" />
          Queens
        </h1>
        <Button asChild size="sm">
          <Link to="/queens/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Queen
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="REPLACED">Replaced</SelectItem>
                  <SelectItem value="DEAD">Dead</SelectItem>
                  <SelectItem value="UNKNOWN">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={hiveFilter} onValueChange={setHiveFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Hive" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hives</SelectItem>
                  {hives?.map((hive) => (
                    <SelectItem key={hive.id} value={hive.id}>
                      {hive.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : !queens || queens.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Crown className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No queens found.</p>
          <Button asChild className="mt-4" size="sm">
            <Link to="/queens/create">Add your first queen</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Queen</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Hive</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Installed</TableHead>
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
                      {queen.hiveName ? (
                        <span className="text-sm">{queen.hiveName}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">No hive</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[queen.status ?? 'UNKNOWN'] ?? 'outline'}>
                        {queen.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {queen.installedAt ? format(parseISO(queen.installedAt), 'PP') : '—'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
