
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MuteJob {
  private readonly date: number = 0;
  constructor(
    private readonly userService: UserService,
    private readonly schedulerRegistry: SchedulerRegistry
  )
  { }

  muteUser(userID: number, channelId: number, timeoutMs: number) {
    
    // TODO: mute user

    const unmuteCallback = async () => {
      // TODO: unmute user
      this.schedulerRegistry.deleteTimeout(`mute-${userID}-${channelId}`);
    };

    const timeoutObject = setTimeout(unmuteCallback, timeoutMs);


    this.schedulerRegistry.addTimeout(
      `mute-${userID}-${channelId}`,
      timeoutObject,
    );
  
  }
  
  unmuteUser(userID: number, channelId: number) {
    
    // TODO: unmute user

    this.schedulerRegistry.deleteTimeout(`mute-${userID}-${channelId}`);
  }
}

