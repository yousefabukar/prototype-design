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

#[test]
fn test_max_cpu() {
    use std::process;
    assert!(SchedulerIface::set_max_cpus(process::id(), 2).is_ok());
}

#[test]
#[allow(clippy::unwrap_used)]
fn test_max_mem() {
    use nix::errno::Errno;

    let err = SchedulerIface::set_max_mem(256_000_000).err().unwrap();

    // Tests are not run as root, so this *should* result in a permissions error
    let EngineError::NixSys(Errno::EPERM) = err else {
        panic!("Didn't get the expected error");
    };
}

#[test]
fn test_uuid() {
    use nix::unistd::Uid;
    assert!(!Uid::current().is_root());
    assert!(!Uid::effective().is_root());
}
