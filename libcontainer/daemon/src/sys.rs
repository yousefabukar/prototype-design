use crate::error::EngineError;
use nix::sched::{self, CpuSet};
use nix::sys::resource::{self, Resource};
use nix::unistd::Pid;

pub struct SchedulerIface;

impl SchedulerIface {
    pub fn set_max_cpus(pid: u32, max_cpus: u8) -> Result<(), EngineError> {
        let mut set = CpuSet::new();
        for i in 0..max_cpus as usize {
            set.set(i)?;
        }

        sched::sched_setaffinity(Pid::from_raw(pid as i32), &set)?;
        Ok(())
    }

    pub fn set_max_mem(mem_bytes: u64) -> Result<(), EngineError> {
        resource::setrlimit(Resource::RLIMIT_MEMLOCK, mem_bytes / 2, mem_bytes)?;
        Ok(())
    }
}
