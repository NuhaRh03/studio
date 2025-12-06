'use client';

import React, { useMemo } from 'react';
import { useDeviceData } from '@/hooks/use-device-data';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wifi, WifiOff, User, Mail, Calendar, Briefcase, TrendingUp, Weight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function SettingsPage() {
  const dataPoints = useDeviceData(1);
  const { profile, loading: profileLoading } = useUserProfile();
  const latestData = useMemo(() => (dataPoints.length > 0 ? dataPoints[dataPoints.length - 1] : null), [dataPoints]);

  const connectionStatus = useMemo(() => {
    if (!latestData) {
      return {
        status: 'Connecting...',
        color: 'bg-yellow-500',
        icon: <Wifi className="h-4 w-4 text-white" />,
        lastUpdate: 'N/A',
      };
    }
    const lastUpdateSeconds = Date.now() / 1000 - latestData.timestamp;
    if (lastUpdateSeconds > 15) {
      return {
        status: 'Disconnected',
        color: 'bg-red-500',
        icon: <WifiOff className="h-4 w-4 text-white" />,
        lastUpdate: `Over ${Math.round(lastUpdateSeconds)}s ago`,
      };
    }
    return {
      status: 'Connected',
      color: 'bg-green-500',
      icon: <Wifi className="h-4 w-4 text-white" />,
      lastUpdate: formatDistanceToNow(new Date(latestData.timestamp * 1000), { addSuffix: true }),
    };
  }, [latestData]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your personal information from your account.</CardDescription>
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <ProfileSkeleton />
            ) : profile ? (
              <div className="space-y-4">
                <ProfileItem icon={<User className="text-primary" />} label="Name" value={profile.name} />
                <ProfileItem icon={<Mail className="text-primary" />} label="Email" value={profile.email} />
                <ProfileItem icon={<Calendar className="text-primary" />} label="Age" value={profile.age.toString()} />
                <ProfileItem icon={<Briefcase className="text-primary" />} label="Job" value={profile.job} />
                <ProfileItem icon={<TrendingUp className="text-primary" />} label="Height" value={`${profile.height_cm} cm`} />
                <ProfileItem icon={<Weight className="text-primary" />} label="Weight" value={`${profile.weight_kg} kg`} />
              </div>
            ) : (
              <p>No profile data found.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sensor Connection</CardTitle>
            <CardDescription>Live status of the connection to your biosensor device.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <div className={`flex items-center justify-center rounded-full h-12 w-12 ${connectionStatus.color}`}>
                {connectionStatus.icon}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{connectionStatus.status}</p>
                <p className="text-sm text-muted-foreground">
                  Last update: {latestData ? connectionStatus.lastUpdate : 'Waiting for data...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const ProfileItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-4">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
      {icon}
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
    ))}
  </div>
);
