use neon::prelude::*;
use std::ops::{Deref, DerefMut};
use tokio::sync::Mutex;

pub struct JsMutex<T>(Mutex<T>);

impl<T> Finalize for JsMutex<T>
where
    T: Finalize,
{
    fn finalize<'a, C: Context<'a>>(self, ctx: &mut C) {
        self.0.into_inner().finalize(ctx);
    }
}

impl<T> Deref for JsMutex<T> {
    type Target = Mutex<T>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<T> DerefMut for JsMutex<T> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}
